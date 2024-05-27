import React, { useState,  FormEvent } from 'react';
import useInput from '../hooks/useInput';
import styles from './ChangeEmailBody.module.scss';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation'
import { CHANGE_EMAIL } from '@/mutations/userMutations';

export default function ChangeEmailBody() {
  const {
    input: newEmail,
    inputIsValid: newEmailIsValid,
    inputIsInvalid: newEmailIsInvalid,
    inputChangeHandler: newEmailChangeHandler,
    inputBlurHandler: newEmailBlurHandler,
  } = useInput((input) => /^\S+@\S+\.\S+$/.test(input));

  const [uniqueEmailIsInvalid, setUniqueEmailIsInvalid] = useState(false)

  const [changeEmail] = useMutation(CHANGE_EMAIL, {
    variables: {
        newEmail: newEmail
    },
    errorPolicy: "all"
  });


  const router = useRouter()
  // consider try catch in future for network errors or some other mysterious error
  const updateEmailSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = await changeEmail()
    if (result.errors)
    {
      console.log("there was errors")
      console.log(result)
      console.log(result.errors[0].extensions.code)
      // obviously put these code in a constant maybe in a file somewhere
      if (result.errors[0].extensions.code === "EMAIL_EXISTS")
      {
        setUniqueEmailIsInvalid(true)
      }
    }
    else if (result.data)
    {
      console.log("it worked")
      //router.push("/dashboard")
    }
   
  };

  // if any of the invalids are true then we allow the red color class to be active
  const emailIsInvalidClass = newEmailIsInvalid || uniqueEmailIsInvalid ? 'invalid' : '';

  const overallFormIsInvalid = !(newEmailIsValid)

  return (
    <div className={styles['register-body']}>
      <form onSubmit={updateEmailSubmitHandler} className={styles['form-container']}>
        <span className={styles['header']}>Update Email</span>
        <div
          className={`${styles['input-container']} ${styles[emailIsInvalidClass]}`}
        >
          <label>New Email</label>
          <input
            placeholder="Example@mail.com"
            onChange={newEmailChangeHandler}
            onBlur={newEmailBlurHandler}
            type="text"
          />
          {newEmailIsInvalid && (
            <span className={styles['invalid-message']}>
              Invalid Email format.
            </span>
          )}
          {uniqueEmailIsInvalid && (
            <span className={styles['invalid-message']}>
              Email is already registered.
            </span>
          )}
        </div>
        <div className={styles['sign-up-button-container']}>
          <button disabled={overallFormIsInvalid} className={styles['sign-up-button']}>Save</button>
        </div>
      </form>
    </div>
  );
}
