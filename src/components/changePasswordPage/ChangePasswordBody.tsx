import React, { useState, FormEvent } from "react";
import useInput from "../hooks/useInput";
import styles from "./ChangePasswordBody.module.scss";
import { useMutation } from "@apollo/client";
import { useSearchParams } from "next/navigation";
import { CHANGE_PASSWORD } from "@/mutations/userMutations";
import { Suspense } from 'react'

export default function ChangePasswordBody() {
  const {
    input: newPassword,
    inputIsValid: newPasswordIsValid,
    inputIsInvalid: newPasswordIsInvalid,
    inputChangeHandler: newPasswordChangeHandler,
    inputBlurHandler: newPasswordBlurHandler,
  } = useInput((input) => input.length >= 6);

  const {
    input: confirmPassword,
    inputIsValid: confirmPasswordIsValid,
    inputIsInvalid: confirmPasswordIsInvalid,
    inputChangeHandler: confirmPasswordChangeHandler,
    inputBlurHandler: confirmPasswordBlurHandler,
  } = useInput((input) => input === newPassword);

  //need a check whether here on this component or the change password
  // component, if you don't have token, gtfo out of this page

  const params = useSearchParams();
  const token = params.get("token")
  console.log("token", params)
  const [changePassword] = useMutation(CHANGE_PASSWORD, {
    variables: {
      newPassword: newPassword,
      token: token,
    },
    errorPolicy: "all",
  });

  const [uniqueUsernameIsInvalid, setUniqueUsernameIsInvalid] = useState(false);
  const [uniqueEmailIsInvalid, setUniqueEmailIsInvalid] = useState(false);

  // consider try catch in future for network errors or some other mysterious error

  const registerSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("gay");
    const result = await changePassword();
    if (result.errors) {
      console.log("there was errors");
      console.log(result);
      console.log(result.errors[0].extensions.code);
      // obviously put these code in a constant maybe in a file somewhere
      if (
        result.errors[0].extensions.code === "EMAIL_EXISTS_AND_USERNAME_TAKEN"
      ) {
        setUniqueUsernameIsInvalid(true);
        setUniqueEmailIsInvalid(true);
      }
    } else if (result.data) {
      console.log("it worked");
      //router.push("/dashboard")
    }
  };

  const passwordIsInvalidClass = newPasswordIsInvalid ? 'invalid' : '';

  const confirmPasswordIsInvalidClass = confirmPasswordIsInvalid ? 'invalid' : '';

  return (
    <div className={styles["register-body"]}>
      <form
        onSubmit={registerSubmitHandler}
        className={styles["form-container"]}
      >
        <span className={styles["header"]}>Change Password</span>
        <div
          className={`${styles['input-container']} ${styles[passwordIsInvalidClass]}`}
        >
          <label>Password</label>
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
          className={`${styles['input-container']} ${styles[confirmPasswordIsInvalidClass]}`}
        >
          <label>Re-Enter Password</label>
          <input
            placeholder="At least 6 characters"
            onChange={confirmPasswordChangeHandler}
            onBlur={confirmPasswordBlurHandler}
            type="password"
          />
          {confirmPasswordIsInvalid && (
            <span className={styles['invalid-message']}>
              Passwords must match.
            </span>
          )}
        </div>
        <div className={styles["sign-up-button-container"]}>
          <button
            disabled={uniqueEmailIsInvalid}
            className={styles["sign-up-button"]}
          >
            Send Reset Link
          </button>
        </div>
      </form>
    </div>
  );
}
