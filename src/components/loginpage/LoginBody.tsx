import React, { useState, FormEvent, useEffect } from "react";
import useInput from "../hooks/useInput";
import styles from "./LoginBody.module.scss";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { LOGIN_USER } from "@/mutations/userMutations";
import Link from "next/link";
import Image from "next/image";
import FormWrapper from "../utilities/FormWrapper";
import FormSubmitButton from "../utilities/FormSubmitButton";
import FormInput from "../utilities/FormInput";
import FormInputInvalidMessage from "../utilities/FormInputInvalidMessage";

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

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    variables: {
      user: {
        user_email: loginEmail.toLowerCase(),
        user_password: loginPassword,
      },
    },
    errorPolicy: "all"
  });

  // gets rid of input errors when the user types again
  useEffect(() => {
    if (uniqueEmailIsInvalid) setUniqueEmailIsInvalid(false);
    if (passwordIsInvalid) setpasswordIsInvalid(false);
  }, [loginEmail, loginPassword]);

  const [uniqueEmailIsInvalid, setUniqueEmailIsInvalid] = useState(false);
  const [passwordIsInvalid, setpasswordIsInvalid] = useState(false);

  const [genericError, setGenericError] = useState(false);
  const [versionError, setVersionError] = useState(false);
  const [rateLimitError, setRateLimitError] = useState(false);

  const router = useRouter();

  const loginSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await loginUser();
      if (!result) {
        setGenericError(true);
        return;
      }

      console.log(result);
      if (result.errors && result.errors.length > 0) {
        const errorCode = result.errors[0].extensions?.code;

        switch (errorCode) {
          case "EMAIL_NOT_REGISTERED":
            setUniqueEmailIsInvalid(true);
            break;
          case "INCORRECT_PASSWORD":
            setpasswordIsInvalid(true);
            break;
          case "VERSION_ERROR":
            setVersionError(true);
            break;
          case "RATE_LIMIT_ERROR":
            setRateLimitError(true);
            break;
          case "EMAIL_NOT_VERIFIED":
            router.push("/email-verification");
            break;
          default:
            setGenericError(true);
        }
      } else if (result.data) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      setGenericError(true);
    }
  };

  return (
    <FormWrapper
      onSubmit={loginSubmitHandler}
      genericError={genericError}
      versionError={versionError}
      rateLimitError={rateLimitError}
      marginTop="5%"
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
      <FormInput
        inputIsInvalid={loginEmailIsInvalid || uniqueEmailIsInvalid}
        label="Email"
        placeholder="example@mail.com"
        onChangeHandler={loginEmailChangeHandler}
        onBlurHandler={loginEmailBlurHandler}
      >
        <FormInputInvalidMessage
          inputIsInvalid={loginEmailIsInvalid}
          message="Blank or invalid email format."
        />
        <FormInputInvalidMessage
          inputIsInvalid={uniqueEmailIsInvalid}
          message="Email is not registered."
        />
      </FormInput>
      <FormInput
        inputIsInvalid={loginPasswordIsInvalid || passwordIsInvalid}
        label="Password"
        placeholder="At least 6 characters"
        onChangeHandler={loginPasswordChangeHandler}
        onBlurHandler={loginPasswordBlurHandler}
        type="password"
      >
        <FormInputInvalidMessage
          inputIsInvalid={passwordIsInvalid}
          message="Incorrect Password."
        />
        <FormInputInvalidMessage
          inputIsInvalid={loginPasswordIsInvalid}
          message="Password field empty."
        />
      </FormInput>
      <span className={styles["forgot-password-link-container"]}>
        <Link
          href={"/forgot-password"}
          className={styles["forgot-password-link"]}
        >
          Forgot Password?
        </Link>
      </span>
      <FormSubmitButton
        formIsInvalid={!(loginEmailIsValid && loginPasswordIsValid)}
        loading={loading}
        buttonText="Login"
      />
      <span className={styles["new-account-link-container"]}>
        Don't have an account?{" "}
        <Link href={"/register"} className={styles["new-account-link"]}>
          Sign Up
        </Link>
      </span>
    </FormWrapper>
  );
}
