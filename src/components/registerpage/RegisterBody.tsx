import React, { useState, FormEvent, useEffect } from "react";
import useInput from "../hooks/useInput";
import styles from "./RegisterBody.module.scss";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { REGISTER_USER } from "@/mutations/userMutations";
import Link from "next/link";
import Image from "next/image";
import { RotatingLines } from 'react-loader-spinner'

export default function RegisterBody() {
  const {
    input: registerUsername,
    inputIsValid: registerUsernameIsValid,
    inputIsInvalid: registerUsernameIsInvalid,
    inputChangeHandler: registerUsernameChangeHandler,
    inputBlurHandler: registerUsernameBlurHandler,
  } = useInput((input) => input.length >= 4 && /^[a-z0-9]+$/i.test(input));

  const {
    input: registerEmail,
    inputIsValid: registerEmailIsValid,
    inputIsInvalid: registerEmailIsInvalid,
    inputChangeHandler: registerEmailChangeHandler,
    inputBlurHandler: registerEmailBlurHandler,
  } = useInput((input) => /^\S+@\S+\.\S+$/.test(input));

  const {
    input: registerPassword,
    inputIsValid: registerPasswordIsValid,
    inputIsInvalid: registerPasswordIsInvalid,
    inputChangeHandler: registerPasswordChangeHandler,
    inputBlurHandler: registerPasswordBlurHandler,
  } = useInput((input) => input.length >= 6);

  const [loading, setLoading] = useState<boolean>(false)

  const [registerUser] = useMutation(REGISTER_USER, {
    variables: {
      user: {
        user_username: registerUsername,
        user_email: registerEmail,
        user_password: registerPassword,
      },
    },
    errorPolicy: "all",
  });

  // clears the error message the user starts typing again
  useEffect(() => {
    if(uniqueUsernameIsInvalid)
    setUniqueUsernameIsInvalid(false)
    if(uniqueEmailIsInvalid)
    setUniqueEmailIsInvalid(false)
  },[registerUsername, registerEmail])

  const [uniqueUsernameIsInvalid, setUniqueUsernameIsInvalid] = useState(false);
  const [uniqueEmailIsInvalid, setUniqueEmailIsInvalid] = useState(false);

  const router = useRouter();
  // consider try catch in future for network errors or some other mysterious error
  const registerSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    const result = await registerUser();
    setLoading(false);
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
      } else if (result.errors[0].extensions.code === "EMAIL_EXISTS") {
        setUniqueEmailIsInvalid(true);
        setUniqueUsernameIsInvalid(false);
      } else if (result.errors[0].extensions.code === "USERNAME_TAKEN") {
        setUniqueUsernameIsInvalid(true);
        setUniqueEmailIsInvalid(false);
      }
    } else if (result.data) {
      console.log("it worked");
      router.push("/dashboard")
    }
  };

  // if any of the invalids are true then we allow the red color class to be active
  const usernameIsInvalidClass =
    registerUsernameIsInvalid || uniqueUsernameIsInvalid ? "invalid" : "";

  const emailIsInvalidClass =
    registerEmailIsInvalid || uniqueEmailIsInvalid ? "invalid" : "";

  const passwordIsInvalidClass = registerPasswordIsInvalid ? "invalid" : "";

  const overallFormIsInvalid = !(
    registerUsernameIsValid &&
    registerEmailIsValid &&
    registerPasswordIsValid
  );

  return (
    <div className={styles["register-body"]}>
      <form
        onSubmit={registerSubmitHandler}
        className={styles["form-container"]}
      >
            <Image
              priority
              src="/paper.svg"
              alt="Down Icon"
              height={100}
              width={100}
              className={styles["website-icon"]}
            />
        <h1 className={styles["header"]}>Create your account</h1>
        <div
          className={`${styles["input-container"]} ${styles[usernameIsInvalidClass]}`}
        >
          <label>Username</label>
          <input
            placeholder="At least 4 characters"
            onChange={registerUsernameChangeHandler}
            onBlur={registerUsernameBlurHandler}
            type="text"
          />
          {registerUsernameIsInvalid && (
            <span className={styles["invalid-message"]}>
              Minimum 4 characters and no special characters.
            </span>
          )}
          {uniqueUsernameIsInvalid && (
            <span className={styles["invalid-message"]}>
              Username is taken.
            </span>
          )}
        </div>
        <div
          className={`${styles["input-container"]} ${styles[emailIsInvalidClass]}`}
        >
          <label>Email</label>
          <input
            placeholder="Example@mail.com"
            onChange={registerEmailChangeHandler}
            onBlur={registerEmailBlurHandler}
            type="text"
          />
          {registerEmailIsInvalid && (
            <span className={styles["invalid-message"]}>
              Invalid Email format.
            </span>
          )}
          {uniqueEmailIsInvalid && (
            <span className={styles["invalid-message"]}>
              Email is already registered.
            </span>
          )}
        </div>
        <div
          className={`${styles["input-container"]} ${styles[passwordIsInvalidClass]}`}
        >
          <label>Password</label>
          <input
            placeholder="At least 6 characters"
            onChange={registerPasswordChangeHandler}
            onBlur={registerPasswordBlurHandler}
            type="password"
          />
          {registerPasswordIsInvalid && (
            <span className={styles["invalid-message"]}>
              Minimum 6 characters.
            </span>
          )}
        </div>
        <div className={styles["sign-up-button-container"]}>
          <button
            disabled={overallFormIsInvalid}
            className={styles["sign-up-button"]}
          >
            {loading ? <RotatingLines
  visible={true}
  width="25"
  strokeWidth="5"
  strokeColor="white"
  animationDuration="0.75"
  ariaLabel="rotating-lines-loading"
  /> : "Sign Up"}
          </button>
        </div>
        <span className={styles["agreement-text"]}>
        By signing up, you agree to our{" "}
        <Link href={"/terms-and-conditions"} className={styles["login-link"]}>
          Terms of use
        </Link>{" "}
        and{" "}
        <Link href={"/privacy-policy"} className={styles["login-link"]}>
          Privacy Policy
        </Link>
      </span>
      <span className={styles["login-text"]}>
        Already have an account?{" "}
        <Link href={"/login"} className={styles["login-link"]}>
          Login
        </Link>
      </span>
      </form>
    </div>
  );
}
