import React, { useState,  FormEvent } from 'react';
import useInput from '../hooks/useInput';
import styles from './UpdatePasswordBody.module.scss';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation'
import { CHANGE_PASSWORD_LOGGED_IN } from '@/mutations/userMutations';

export default function UpdatePasswordBody() {
  const {
    input: currentPassword,
    inputIsValid: currentPasswordIsValid,
    inputIsInvalid: currentPasswordIsInvalid,
    inputChangeHandler: currentPasswordChangeHandler,
    inputBlurHandler: currentPasswordBlurHandler,
  } = useInput((input) => input.length >= 6 )

  const {
    input: newPassword,
    inputIsValid: newPasswordIsValid,
    inputIsInvalid: newPasswordIsInvalid,
    inputChangeHandler: newPasswordChangeHandler,
    inputBlurHandler: newPasswordBlurHandler,
  } = useInput((input) => input.length >= 6 )

  const {
    input: confirmNewPassword,
    inputIsValid: confirmNewPasswordIsValid,
    inputIsInvalid: confirmNewPasswordIsInvalid,
    inputChangeHandler: confirmNewPasswordChangeHandler,
    inputBlurHandler: confirmNewPasswordBlurHandler,
  } = useInput((input) => input === newPassword )

  const [changePasswordLoggedIn] = useMutation(CHANGE_PASSWORD_LOGGED_IN, {
    variables: {
        currentPassword: currentPassword,
        newPassword: confirmNewPassword
    },
    errorPolicy: "all"
  });


  const router = useRouter()
  // consider try catch in future for network errors or some other mysterious error
  const updatePasswordSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = await changePasswordLoggedIn()
    if (result.errors)
    {
      console.log("there was errors")
      console.log(result)
      console.log(result.errors[0].extensions.code)
      // obviously put these code in a constant maybe in a file somewhere
    }
    else if (result.data)
    {
      console.log("it worked")
      //router.push("/dashboard")
    }
   
  };

  // if any of the invalids are true then we allow the red color class to be active
  const currentPasswordIsInvalidClass = currentPasswordIsInvalid ? 'invalid' : '';
  const newPasswordIsInvalidClass = newPasswordIsInvalid ? 'invalid' : '';
  const confirmNewPasswordIsInvalidClass = confirmNewPasswordIsInvalid ? 'invalid' : '';

  const overallFormIsInvalid = !(confirmNewPasswordIsValid && newPasswordIsValid && currentPasswordIsValid)

  return (
    <div className={styles['register-body']}>
      <form onSubmit={updatePasswordSubmitHandler} className={styles['form-container']}>
        <span className={styles['header']}>Update Password</span>
        <div
          className={`${styles['input-container']} ${styles[currentPasswordIsInvalidClass]}`}
        >
          <label>Current Password</label>
          <input
            placeholder="At least 6 characters"
            onChange={currentPasswordChangeHandler}
            onBlur={currentPasswordBlurHandler}
            type="password"
          />
          {currentPasswordIsInvalid && (
            <span className={styles['invalid-message']}>
              Minimum 6 characters.
            </span>
          )}
        </div>
        <div
          className={`${styles['input-container']} ${styles[newPasswordIsInvalidClass]}`}
        >
          <label>New Password</label>
          <input
            placeholder="At least 6 characters"
            onChange={newPasswordChangeHandler}
            onBlur={newPasswordBlurHandler}
            type="password"
          />
          {newPasswordIsInvalid && (
            <span className={styles['invalid-message']}>
              Minimum 6 characters.
            </span>
          )}
        </div>
        <div
          className={`${styles['input-container']} ${styles[confirmNewPasswordIsInvalidClass]}`}
        >
          <label>Confirm New Password</label>
          <input
            placeholder="At least 6 characters"
            onChange={confirmNewPasswordChangeHandler}
            onBlur={confirmNewPasswordBlurHandler}
            type="password"
          />
          {confirmNewPasswordIsInvalid && (
            <span className={styles['invalid-message']}>
              Passwords must match.
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
