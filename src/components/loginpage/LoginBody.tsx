import React, { useState, FormEvent, useEffect } from "react";
import useInput from "../hooks/useInput";
import styles from "./LoginBody.module.scss";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { LOGIN_USER } from "@/mutations/userMutations";
import Link from "next/link";
import Image from "next/image";
import { RotatingLines } from 'react-loader-spinner'

export default function LoginBody() {
  const {
    input: loginEmail,
    inputIsValid: loginEmailIsValid,
    inputIsInvalid: loginEmailIsInvalid,
    inputChangeHandler: loginEmailChangeHandler,
    inputBlurHandler: loginEmailBlurHandler,
  } = useInput((input) => /^\S+@\S+\.\S+$/.test(input));

  const {
    input: loginPassword,
    inputIsValid: loginPasswordIsValid,
    inputIsInvalid: loginPasswordIsInvalid,
    inputChangeHandler: loginPasswordChangeHandler,
    inputBlurHandler: loginPasswordBlurHandler,
  } = useInput((input) => input.length >= 1);

  const [loading, setLoading] = useState<boolean>(false)

  const [loginUser] = useMutation(LOGIN_USER, {
    variables: {
      user: {
        user_email: loginEmail,
        user_password: loginPassword,
      },
    },
    errorPolicy: "all",
  });

  useEffect(() => {
    if(uniqueEmailIsInvalid)
    setUniqueEmailIsInvalid(false)
  if(passwordIsInvalid)
  setpasswordIsInvalid(false)
  },[loginEmail, loginPassword])

  const [uniqueEmailIsInvalid, setUniqueEmailIsInvalid] = useState(false);
  const [passwordIsInvalid, setpasswordIsInvalid] = useState(false);

  const router = useRouter();
  // consider try catch in future for network errors or some other mysterious error
  const loginSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    const result = await loginUser();
    setLoading(false);
    if (result.errors) {
      console.log("there was errors");
      console.log(result);
      console.log(result.errors[0].extensions.code);
      // obviously put these code in a constant maybe in a file somewhere
      if (result.errors[0].extensions.code === "EMAIL_NOT_REGISTERED") {
        setUniqueEmailIsInvalid(true);
      } else if (result.errors[0].extensions.code === "INCORRECT_PASSWORD") {
        setpasswordIsInvalid(true);
      } else setpasswordIsInvalid(true);
    } else if (result.data) {
      console.log("it worked");
      console.log(result);
      router.push("/dashboard");
    }
  };

  // if any of the invalids are true then we allow the red color class to be active

  const emailIsInvalidClass =
    loginEmailIsInvalid || uniqueEmailIsInvalid ? "invalid" : "";

  const passwordIsInvalidClass = loginPasswordIsInvalid || passwordIsInvalid ? "invalid" : "";

  const overallFormIsInvalid = !(loginEmailIsValid && loginPasswordIsValid);

  return (
    <div className={styles["login-body"]}>
        <form
          onSubmit={loginSubmitHandler}
          className={styles["form-container"]}
        >
           <Image
              priority
              src="/MyFapSheetSVG.svg"
              alt="Down Icon"
              height={0}
              width={75}
              className={styles["website-icon"]}
            />
        <h1 className={styles["header"]}>Welcome Back</h1>
          <div
            className={`${styles["input-container"]} ${styles[emailIsInvalidClass]}`}
          >
            <label>Email</label>
            <input
              placeholder="Example@mail.com"
              onChange={loginEmailChangeHandler}
              onBlur={loginEmailBlurHandler}
              type="text"
            />
            {loginEmailIsInvalid && (
              <span className={styles["invalid-message"]}>
                Invalid Email format.
              </span>
            )}
            {uniqueEmailIsInvalid && (
              <span className={styles["invalid-message"]}>
                Email is not registered.
              </span>
            )}
          </div>
          <div
            className={`${styles["input-container"]} ${styles[passwordIsInvalidClass]}`}
          >
            <label>Password</label>
            <input
              placeholder="At least 6 characters"
              onChange={loginPasswordChangeHandler}
              onBlur={loginPasswordBlurHandler}
              type="password"
            />
            {passwordIsInvalid && (
            <div className={`${styles["invalid"]}`}>
              <span className={styles["invalid-message"]}>
                Incorrect Password.
              </span>
            </div>
          )}
            {loginPasswordIsInvalid && (
              <span className={styles["invalid-message"]}>
                Password field empty.
              </span>
            )}
          </div>
          <span className={styles["forgot-password-link-container"]}><Link href={"/forgot-password"} className={styles["forgot-password-link"]}>
            Forgot Password?
          </Link></span>
          <div className={styles["sign-up-button-container"]}>
            <button
              disabled={overallFormIsInvalid || loading}
              className={styles["sign-up-button"]}
            >
              {loading ? <RotatingLines
  visible={true}
  width="25"
  strokeWidth="5"
  strokeColor="white"
  animationDuration="0.75"
  ariaLabel="rotating-lines-loading"
  /> : "Login"}
            </button>
          </div>
          <span className={styles["new-account-link-container"]}>Don't have an account? <Link href={"/register"} className={styles["new-account-link"]}>
            Sign Up
          </Link></span>
        </form>
    </div>
  );
}
