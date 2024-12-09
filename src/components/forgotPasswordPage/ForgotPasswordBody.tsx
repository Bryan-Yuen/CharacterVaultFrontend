import React, { useState, FormEvent, useEffect } from "react";
import useInput from "../hooks/useInput";
//import styles from "./ForgotPasswordBody.module.scss";
import { useMutation } from "@apollo/client";
import { FORGOT_PASSWORD } from "@/mutations/userMutations";
import FormWrapper from "../utilities/FormWrapper";
import FormInput from "../utilities/FormInput";
import FormInputInvalidMessage from "../utilities/FormInputInvalidMessage";
import FormSubmitButton from "../utilities/FormSubmitButton";
import FormHeader from "../utilities/FormHeader";
import SuccessMessage from "../utilities/SuccessMessage";

export default function ForgotPasswordBody() {
  const {
    input: forgotPasswordEmail,
    inputIsValid: forgotPasswordEmailIsValid,
    inputIsInvalid: forgotPasswordEmailIsInvalid,
    inputChangeHandler: forgotPasswordEmailChangeHandler,
    inputBlurHandler: forgotPasswordEmailBlurHandler,
  } = useInput((input) => /^\S+@\S+\.\S+$/.test(input));

  const [forgotPassword, { loading }] = useMutation(FORGOT_PASSWORD, {
    variables: {
      forgotPasswordInput: {
        user_email: forgotPasswordEmail,
      }
    },
    errorPolicy: "all"
  });

  // clears the error message the user starts typing again
  useEffect(() => {
    if (uniqueEmailIsInvalid) setUniqueEmailIsInvalid(false);
  }, [forgotPasswordEmail]);

  const [uniqueEmailIsInvalid, setUniqueEmailIsInvalid] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const [genericError, setGenericError] = useState(false);
  const [versionError, setVersionError] = useState(false);
  const [rateLimitError, setRateLimitError] = useState(false);

  const forgotPasswordSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await forgotPassword();
      if (!result) {
        setGenericError(true);
        return;
      }
      if (result.errors && result.errors.length > 0) {
        const errorCode = result.errors[0].extensions?.code;

        switch (errorCode) {
          case "EMAIL_NOT_REGISTERED":
            setUniqueEmailIsInvalid(true);
            break;
          case "VERSION_ERROR":
            setVersionError(true);
            break;
          case "RATE_LIMIT_ERROR":
            setRateLimitError(true)
            break;
          default:
            setGenericError(true);
        }
      } else if (result.data) {
        setEmailSent(true);
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      setGenericError(true);
    }
  };

  return (
    <FormWrapper
      onSubmit={forgotPasswordSubmitHandler}
      genericError={genericError}
      versionError={versionError}
      rateLimitError={rateLimitError}
    >
      <FormHeader header="Reset Password"></FormHeader>
      <FormInput
        inputIsInvalid={forgotPasswordEmailIsInvalid || uniqueEmailIsInvalid}
        label="Email"
        placeholder="example@mail.com"
        onChangeHandler={forgotPasswordEmailChangeHandler}
        onBlurHandler={forgotPasswordEmailBlurHandler}
        value={forgotPasswordEmail}
      >
        <FormInputInvalidMessage
          inputIsInvalid={forgotPasswordEmailIsInvalid}
          message="Blank or invalid Email format."
        />
        <FormInputInvalidMessage
          inputIsInvalid={uniqueEmailIsInvalid}
          message="Email is not registered"
        />
      </FormInput>
      <FormSubmitButton
        formIsInvalid={!forgotPasswordEmailIsValid}
        loading={loading}
        buttonText="Send Reset Link"
      />
      <SuccessMessage
        showSuccessMessage={emailSent}
        
      >An email has been sent to the email address provided. Please click on
          the link to reset your password.</SuccessMessage>
    </FormWrapper>
  );
}
