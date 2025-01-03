import React, { useState, FormEvent, useEffect } from "react";
import useInput from "../hooks/useInput";
import styles from "./RegisterBody.module.scss";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { REGISTER_USER } from "@/mutations/userMutations";
import Link from "next/link";
import Image from "next/image";
import FormWrapper from "../utilities/FormWrapper";
import FormInput from "../utilities/FormInput";
import FormInputInvalidMessage from "../utilities/FormInputInvalidMessage";
import FormSubmitButton from "../utilities/FormSubmitButton";
import { useApolloClient } from "@apollo/client";

export default function RegisterBody() {
  const {
    input: registerUsername,
    inputIsValid: registerUsernameIsValid,
    inputIsInvalid: registerUsernameIsInvalid,
    inputChangeHandler: registerUsernameChangeHandler,
    inputBlurHandler: registerUsernameBlurHandler,
  } = useInput((input) => input.length >= 3 && /^[a-z0-9]+$/i.test(input));

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

  const [registerUser, { loading }] = useMutation(REGISTER_USER, {
    variables: {
      user: {
        user_username: registerUsername,
        user_email: registerEmail.toLowerCase(),
        user_password: registerPassword,
      },
    },
    errorPolicy: "all"
  });
  const client = useApolloClient();
  // clears the error message the user starts typing again
  useEffect(() => {
    if (uniqueUsernameIsInvalid) setUniqueUsernameIsInvalid(false);
    if (uniqueEmailIsInvalid) setUniqueEmailIsInvalid(false);
  }, [registerUsername, registerEmail]);

  const [uniqueUsernameIsInvalid, setUniqueUsernameIsInvalid] = useState(false);
  const [uniqueEmailIsInvalid, setUniqueEmailIsInvalid] = useState(false);

  const [genericError, setGenericError] = useState(false);
  const [versionError, setVersionError] = useState(false);
  const [rateLimitError, setRateLimitError] = useState(false);

  const router = useRouter();
  // consider try catch in future for network errors or some other mysterious error
  const registerSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const result = await registerUser();
      if (!result) {
        setGenericError(true);
        return;
      }
      console.log(result);
      // Check for errors
      if (result.errors && result.errors.length > 0) {
        const errorCode = result.errors[0].extensions?.code;

        switch (errorCode) {
          case "EMAIL_EXISTS":
            setUniqueEmailIsInvalid(true);
            setUniqueUsernameIsInvalid(false);
            break;
          case "USERNAME_TAKEN":
            setUniqueUsernameIsInvalid(true);
            setUniqueEmailIsInvalid(false);
            break;
          case "VERSION_ERROR":
            setVersionError(true);
            break;
          case "RATE_LIMIT_ERROR":
            setRateLimitError(true);
            break;
          default:
            setGenericError(true);
        }
      }
      // Success case
      else if (result.data) {
        // remove old userprofile if for some reason the user decides to register for another account after making different account in registration
        client.cache.evict({ id: "UserProfileReturn" });
        client.cache.gc();
        console.log("Registration successful");
        router.push("/email-verification");
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      setGenericError(true);
    }
  };

  return (
    <FormWrapper
      onSubmit={registerSubmitHandler}
      genericError={genericError}
      versionError={versionError}
      rateLimitError={rateLimitError}
      marginTop="5%"
    >
      <Image
        priority
        src="/MyFapSheetSVG.svg"
        alt="paper with splash icon"
        height={0}
        width={75}
        className={styles["website-icon"]}
      />
      <h1 className={styles["header"]}>Create your account</h1>
      <FormInput
        inputIsInvalid={registerUsernameIsInvalid || uniqueUsernameIsInvalid}
        label="Username"
        placeholder="At least 3 characters"
        onChangeHandler={registerUsernameChangeHandler}
        onBlurHandler={registerUsernameBlurHandler}
      >
        <FormInputInvalidMessage
          inputIsInvalid={registerUsernameIsInvalid}
          message="Minimum 3 characters and no special characters."
        />
        <FormInputInvalidMessage
          inputIsInvalid={uniqueUsernameIsInvalid}
          message="Username is taken."
        />
      </FormInput>
      <FormInput
        inputIsInvalid={registerEmailIsInvalid || uniqueEmailIsInvalid}
        label="Email"
        placeholder="example@mail.com"
        onChangeHandler={registerEmailChangeHandler}
        onBlurHandler={registerEmailBlurHandler}
      >
        <FormInputInvalidMessage
          inputIsInvalid={registerEmailIsInvalid}
          message="Blank or invalid email format."
        />
        <FormInputInvalidMessage
          inputIsInvalid={uniqueEmailIsInvalid}
          message="Email is already registered."
        />
      </FormInput>
      <FormInput
        inputIsInvalid={registerPasswordIsInvalid}
        label="Password"
        placeholder="At least 6 characters"
        onChangeHandler={registerPasswordChangeHandler}
        onBlurHandler={registerPasswordBlurHandler}
        type="password"
      >
        <FormInputInvalidMessage
          inputIsInvalid={registerPasswordIsInvalid}
          message="Minimum 6 characters."
        />
      </FormInput>
      <FormSubmitButton
        formIsInvalid={
          !(
            registerUsernameIsValid &&
            registerEmailIsValid &&
            registerPasswordIsValid
          )
        }
        loading={loading}
        buttonText="Sign Up"
      />
      <span className={styles["agreement-text"]}>
        By signing up, you agree to our{" "}
        <Link href={"/terms-of-service"} className={styles["login-link"]}>
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
    </FormWrapper>
  );
}
