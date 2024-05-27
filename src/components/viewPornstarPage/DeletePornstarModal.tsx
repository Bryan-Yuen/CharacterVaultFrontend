import React, {FormEvent, useState, useEffect} from 'react';
import styles from './DeletePornstarModal.module.scss';
import { DELETE_PORNSTAR } from '@/mutations/pornstarMutations';
import { useMutation } from '@apollo/client';
import useInput from '../hooks/useInput';
import PornstarName from '../pornstarInputComponents/PornstarName';
import { useApolloClient } from '@apollo/client';
import { useRouter } from 'next/navigation';

interface propDefs {
  pornstar_id : number;
  pornstar_name : string;
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DeletePornstarModal(props: propDefs) {
 const client = useApolloClient();
 const router = useRouter();

 const [deletePornstar] = useMutation(DELETE_PORNSTAR, {
    variables: {
      deletePornstarInput: {
        pornstar_id: props.pornstar_id,
      },
    },
    errorPolicy: 'all',
  });

  const deletePornstarHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("delete boy")
    const result = await deletePornstar();
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
        pornstar_id: props.pornstar_id,
        __typename: 'PornstarWithTags',
      });
      client.cache.evict({ id: normalizedId });
      client.cache.gc();
    
    props.setModalIsOpen(false);
    router.back();
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
             <span>{props.pornstar_name} will be removed from all pornstars</span>
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
