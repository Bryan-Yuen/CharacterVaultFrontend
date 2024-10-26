import React, { useState, FormEvent } from "react";
import useInput from "../hooks/useInput";
import styles from "./ChangePasswordBody.module.scss";
import { useMutation } from "@apollo/client";
import { useSearchParams } from "next/navigation";
import { CHANGE_PASSWORD } from "@/mutations/userMutations";
import { RotatingLines } from "react-loader-spinner";

export default function ChangePasswordBody() {
  const {
    input: newPassword,
    inputIsValid: newPasswordIsValid,
    inputIsInvalid: newPasswordIsInvalid,
    inputChangeHandler: newPasswordChangeHandler,
    inputBlurHandler: newPasswordBlurHandler,
    setInput: newPasswordSetInput
  } = useInput((input) => input.length >= 6);

  const {
    input: confirmPassword,
    inputIsValid: confirmPasswordIsValid,
    inputIsInvalid: confirmPasswordIsInvalid,
    inputChangeHandler: confirmPasswordChangeHandler,
    inputBlurHandler: confirmPasswordBlurHandler,
    setInput: confirmPasswordSetInput
  } = useInput((input) => input === newPassword);

  //need a check whether here on this component or the change password
  // component, if you don't have token, gtfo out of this page

  const params = useSearchParams();
  const token = params.get("token");
  console.log("token", params);
  const [changePassword, {loading}] = useMutation(CHANGE_PASSWORD, {
    variables: {
      newPassword: confirmPassword,
      token: token,
    },
    errorPolicy: "all",
  });

  const [passwordChanged, setPasswordChanged] = useState(false);
  const [genericError, setGenericError] = useState(false);
  const [tokenExpired, setTokenExpired] = useState(false);

  // consider try catch in future for network errors or some other mysterious error

  const registerSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await changePassword();
      if (!result) {
        setGenericError(true);
        return;
      }
      if (result.errors && result.errors.length > 0) {
        if (result.errors[0].extensions.code === "TOKEN_EXPIRED") {
          setTokenExpired(true);
        } else setGenericError(true);
      } else if (result.data) {
        console.log("it worked");
        newPasswordSetInput("")
        confirmPasswordSetInput("")
        setPasswordChanged(true);
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      setGenericError(true);
    }
  };

  const passwordIsInvalidClass = newPasswordIsInvalid ? "invalid" : "";

  const confirmPasswordIsInvalidClass = confirmPasswordIsInvalid
    ? "invalid"
    : "";

  return (
    <main className={styles["register-body"]}>
      <form
        onSubmit={registerSubmitHandler}
        className={styles["form-container"]}
      >
        <span className={styles["header"]}>Change Password</span>
        <div
          className={`${styles["input-container"]} ${styles[passwordIsInvalidClass]}`}
        >
          <label>New Password</label>
          <input
            placeholder="At least 6 characters"
            onChange={newPasswordChangeHandler}
            onBlur={newPasswordBlurHandler}
            type="password"
          />
          {newPasswordIsInvalid && (
            <span className={styles["invalid-message"]}>
              Minimum 6 characters.
            </span>
          )}
        </div>
        <div
          className={`${styles["input-container"]} ${styles[confirmPasswordIsInvalidClass]}`}
        >
          <label>Re-Enter New Password</label>
          <input
            placeholder="Passwords must match"
            onChange={confirmPasswordChangeHandler}
            onBlur={confirmPasswordBlurHandler}
            type="password"
          />
          {confirmPasswordIsInvalid && (
            <span className={styles["invalid-message"]}>
              Passwords must match.
            </span>
          )}
        </div>
        <div className={styles["sign-up-button-container"]}>
          <button
            disabled={!(newPasswordIsValid && confirmPasswordIsValid) || loading}
            className={styles["sign-up-button"]}
          >
                        {loading ? (
              <RotatingLines
                visible={true}
                width="25"
                strokeWidth="5"
                strokeColor="white"
                animationDuration="0.75"
                ariaLabel="rotating-lines-loading"
              />
            ) : (
              "Update Password"
            )}
          </button>
        </div>
        {passwordChanged && (
          <span className={styles["success-message"]}>
            Password has been updated.
          </span>
        )}
        {tokenExpired && (
          <span className={styles["server-error-message"]}>
            The link has expired. Please request a new link.
          </span>
        )}
        {genericError && (
          <span className={styles["server-error-message"]}>
            Server Error. Please Refresh Page or try again later.
          </span>
        )}
      </form>
    </main>
  );
}
