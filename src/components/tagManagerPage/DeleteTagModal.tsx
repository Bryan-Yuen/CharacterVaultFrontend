import React, {FormEvent, useState, useEffect} from 'react';
import styles from './DeleteTagModal.module.scss';
import { DELETE_USER_TAG } from '@/mutations/userTag';
import { useMutation } from '@apollo/client';
import useInput from '../hooks/useInput';
import PornstarName from '../pornstarInputComponents/PornstarName';
import { useApolloClient } from '@apollo/client';

interface propDefs {
  user_tag_id : number;
  user_tag_text : string;
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DeleteTagModal(props: propDefs) {
 const client = useApolloClient();

  const [deleteUserTag] = useMutation(DELETE_USER_TAG, {
    variables: {
        userTagId: {
          user_tag_id: props.user_tag_id,
        },
      },
    errorPolicy: 'all',
  });

  const deletePornstarHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("sup", props.user_tag_id)
    const result = await deleteUserTag();
    if (result.errors) {
      console.log('there was errors');
      console.log(result);
      console.log(result.errors[0].extensions.code);
      // obviously put these code in a constant maybe in a file somewhere
    } else if (result.data) {
      console.log(result.data);
      console.log('yyyyyyyyyyyy')
      console.log('it worked');
      //router.push("/dashboard")
    }
    console.log(result.data);

    const normalizedId = client.cache.identify({
        user_tag_id: props.user_tag_id,
        __typename: 'UserTag',
      });
      client.cache.evict({ id: normalizedId });
      client.cache.gc();
    
    props.setModalIsOpen(false);
  };
  
  return (
    <div
      className={styles['backdrop']}
      onClick={() => props.setModalIsOpen(false)}
    >
      <div className={styles['modal']} onClick={(e) => e.stopPropagation()}>
        <div className={styles['modal-header']}>
          <div className={styles['modal-title']}>Confirm Delete</div>
          <button
            onClick={() => props.setModalIsOpen(false)}
            className={styles['close']}
          >
            &#10006;
          </button>
        </div>
        <form
          onSubmit={deletePornstarHandler}
          className={styles['form-container']}
        >
             <span>{props.user_tag_text} will be removed from all pornstars</span>
          <div className={styles['sign-up-button-container']}>
            <button
              className={styles['sign-up-button']}
              type="submit"
            >
              Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
