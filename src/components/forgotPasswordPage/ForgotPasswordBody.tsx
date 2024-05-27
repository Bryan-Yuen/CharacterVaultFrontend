import React, { useState,  FormEvent } from 'react';
import useInput from '../hooks/useInput';
import styles from './ForgotPasswordBody.module.scss';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation'
import { FORGOT_PASSWORD } from '@/mutations/userMutations';

export default function ForgotPasswordBody() {
  const {
    input: registerEmail,
    inputIsValid: registerEmailIsValid,
    inputIsInvalid: registerEmailIsInvalid,
    inputChangeHandler: registerEmailChangeHandler,
    inputBlurHandler: registerEmailBlurHandler,
  } = useInput((input) => /^\S+@\S+\.\S+$/.test(input));

  
  const [forgotPassword] = useMutation(FORGOT_PASSWORD, {
    variables: {
      email: registerEmail
    },
    errorPolicy: "all"
  });

  const [uniqueUsernameIsInvalid, setUniqueUsernameIsInvalid] = useState(false)
  const [uniqueEmailIsInvalid, setUniqueEmailIsInvalid] = useState(false)

  const router = useRouter()
  // consider try catch in future for network errors or some other mysterious error

  const registerSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("gay")
    const result = await forgotPassword()
    if (result.errors)
    {
      console.log("there was errors")
      console.log(result)
      console.log(result.errors[0].extensions.code)
      // obviously put these code in a constant maybe in a file somewhere
      if (result.errors[0].extensions.code === "EMAIL_EXISTS_AND_USERNAME_TAKEN")
      {
        setUniqueUsernameIsInvalid(true)
        setUniqueEmailIsInvalid(true)
      }
    }
    else if (result.data)
    {
      console.log("it worked")
      //router.push("/dashboard")
    }
   
  };

  const emailIsInvalidClass = registerEmailIsInvalid || uniqueEmailIsInvalid ? 'invalid' : '';


  return (
    <div className={styles['register-body']}>
      <form onSubmit={registerSubmitHandler} className={styles["form-container"]}>
        <span className={styles['header']}>Reset Password</span>
        <div
          className={`${styles['input-container']} ${styles[emailIsInvalidClass]}`}
        >
          <label>Email</label>
          <input
            placeholder="Example@mail.com"
            onChange={registerEmailChangeHandler}
            onBlur={registerEmailBlurHandler}
            type="text"
          />
          {registerEmailIsInvalid && (
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
          <button disabled={uniqueEmailIsInvalid} className={styles['sign-up-button']}>Send Reset Link</button>
        </div>
      </form>
    </div>
  );
}
