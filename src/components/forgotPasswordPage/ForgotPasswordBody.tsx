import React, { useState, FormEvent, useEffect } from "react";
import useInput from "../hooks/useInput";
import styles from "./ForgotPasswordBody.module.scss";
import { useMutation } from "@apollo/client";
import { FORGOT_PASSWORD } from "@/mutations/userMutations";
import { RotatingLines } from "react-loader-spinner";

export default function ForgotPasswordBody() {
  const {
    input: registerEmail,
    inputIsValid: registerEmailIsValid,
    inputIsInvalid: registerEmailIsInvalid,
    inputChangeHandler: registerEmailChangeHandler,
    inputBlurHandler: registerEmailBlurHandler,
    setInput: registerEmailSetInput,
    setIsTouched: registerEmailSetIsTouched
  } = useInput((input) => /^\S+@\S+\.\S+$/.test(input));

  const [forgotPassword, {loading}] = useMutation(FORGOT_PASSWORD, {
    variables: {
      email: registerEmail,
    },
    errorPolicy: "all",
  });

    // clears the error message the user starts typing again
    useEffect(() => {
      if (uniqueEmailIsInvalid) setUniqueEmailIsInvalid(false);
    }, [ registerEmail]);

  const [uniqueEmailIsInvalid, setUniqueEmailIsInvalid] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [genericError, setGenericError] = useState(false);
  // consider try catch in future for network errors or some other mysterious error

  const registerSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await forgotPassword();
      if (!result) {
        setGenericError(true);
        return;
      }
      if (result.errors && result.errors.length > 0) {
        if (result.errors[0].extensions.code === "EMAIL_NOT_REGISTERED") {
          setUniqueEmailIsInvalid(true);
        } else setGenericError(true);
      } else if (result.data) {
        console.log("it worked",result.data);
        registerEmailSetInput("")
        registerEmailSetIsTouched(false)
        setEmailSent(true);
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      setGenericError(true);
    }
  };

  const emailIsInvalidClass =
    registerEmailIsInvalid || uniqueEmailIsInvalid ? "invalid" : "";

  return (
    <main className={styles["register-body"]}>
      <form
        onSubmit={registerSubmitHandler}
        className={styles["form-container"]}
      >
        <h2 className={styles["header"]}>Reset Password</h2>
        <div
          className={`${styles["input-container"]} ${styles[emailIsInvalidClass]}`}
        >
          <label>Email</label>
          <input
            placeholder="Example@mail.com"
            onChange={registerEmailChangeHandler}
            onBlur={registerEmailBlurHandler}
            type="text"
            value={registerEmail}
          />
          {registerEmailIsInvalid && (
            <span className={styles["invalid-message"]}>
              Blank or invalid Email format.
            </span>
          )}
          {uniqueEmailIsInvalid && (
            <span className={styles["invalid-message"]}>
              Email is not registered.
            </span>
          )}
        </div>
        <div className={styles["sign-up-button-container"]}>
          <button
            disabled={!registerEmailIsValid || loading}
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
              "Send Reset Link"
            )}
          </button>
        </div>
        {emailSent && (
          <span className={styles["success-message"]}>
            An email has been sent to the email address provided. Please click
            on the link to reset your password.
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
