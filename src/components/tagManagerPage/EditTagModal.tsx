import React, {FormEvent, useState, useEffect} from 'react';
import styles from './EditTagModal.module.scss';
import { EDIT_USER_TAG } from '@/mutations/userTag';
import { useMutation } from '@apollo/client';
import useInput from '../hooks/useInput';
import PornstarName from '../pornstarInputComponents/PornstarName';
import { useApolloClient } from '@apollo/client';

interface propDefs {
  user_tag_id : number;
  user_tag_text : string;
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function EditTagModal(props: propDefs) {
  const {
    input: tag,
    inputIsValid: tagIsValid,
    inputIsInvalid: tagIsInvalid,
    inputChangeHandler: tagChangeHandler,
    inputBlurHandler: tagBlurHandler,
    setInput: setTag
  } = useInput((input) => input.length >= 1);

  useEffect(() => {
    setTag(props.user_tag_text)
  },[])

  const client = useApolloClient();

  const [editUserTag] = useMutation(EDIT_USER_TAG, {
    variables: {
      editUserTagInput: {
        user_tag_id: props.user_tag_id,
        user_tag_text: tag
      },
    },
    errorPolicy: 'all',
  });

  const editPornstarHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = await editUserTag();
    if (result.errors) {
      console.log('there was errors');
      console.log(result);
      console.log(result.errors[0].extensions.code);
      // obviously put these code in a constant maybe in a file somewhere
    } else if (result.data) {
      console.log(result.data);
      console.log('it worked');
      //router.push("/dashboard")
    }
    console.log(result.data);

    await client.refetchQueries({
      include: ["GetUserTags"],
    });
    
    props.setModalIsOpen(false);
  };

  const tagIsInvalidClass =
  tagIsInvalid  ? "invalid" : "";
  
  return (
    <div
      className={styles['backdrop']}
      onClick={() => props.setModalIsOpen(false)}
    >
      <div className={styles['modal']} onClick={(e) => e.stopPropagation()}>
        <div className={styles['modal-header']}>
          <div className={styles['modal-title']}>Edit Tag</div>
          <button
            onClick={() => props.setModalIsOpen(false)}
            className={styles['close']}
          >
            &#10006;
          </button>
        </div>
        <form
          onSubmit={editPornstarHandler}
          className={styles['form-container']}
        >
                                            <div
            className={`${styles["input-container"]} ${styles[tagIsInvalidClass]}`}
          >
            <label>Tag</label>
            <input
              placeholder="tag"
              onChange={tagChangeHandler}
              onBlur={tagBlurHandler}
              value={tag}
              type="text"
            />
            {tagIsInvalid && (
              <span className={styles["invalid-message"]}>
                Tag is blank.
              </span>
            )}
          </div>
          <div className={styles['sign-up-button-container']}>
            <button
              disabled={!tagIsValid}
              className={styles['sign-up-button']}
              type="submit"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
