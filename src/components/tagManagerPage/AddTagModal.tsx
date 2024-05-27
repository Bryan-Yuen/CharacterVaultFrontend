import React, {FormEvent} from 'react';
import styles from './AddTagModal.module.scss';
import { ADD_USER_TAG } from '@/mutations/userTag';
import { useMutation } from '@apollo/client';
import useInput from '../hooks/useInput';
import PornstarName from '../pornstarInputComponents/PornstarName';
import { useApolloClient } from '@apollo/client';

interface propDefs {
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  showSuccessfulPopup: () => void;
}

export default function AddTagModal(props: propDefs) {
  const {
    input: tag,
    inputIsValid: tagIsValid,
    inputIsInvalid: tagIsInvalid,
    inputChangeHandler: tagChangeHandler,
    inputBlurHandler: tagBlurHandler,
  } = useInput((input) => input.length >= 1);

  const [addUserTag] = useMutation(ADD_USER_TAG, {
    variables: {
      newUserTag: {
        user_tag_text: tag
      },
    },
    errorPolicy: 'all',
  });

  const client = useApolloClient();

  const addPornstarHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!tagIsValid)
      {
        tagBlurHandler()
        return;
      }
    const result = await addUserTag();
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
    props.showSuccessfulPopup();
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
          <div className={styles['modal-title']}>Add Tag</div>
          <button
            onClick={() => props.setModalIsOpen(false)}
            className={styles['close']}
          >
            &#10006;
          </button>
        </div>
        <form
          onSubmit={addPornstarHandler}
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
              className={styles['sign-up-button']}
              type="submit"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
