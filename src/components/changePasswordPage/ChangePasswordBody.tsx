import React, { useState, FormEvent } from "react";
import useInput from "../hooks/useInput";
import styles from "./ChangePasswordBody.module.scss";
import { useMutation } from "@apollo/client";
import { useSearchParams } from "next/navigation";
import { CHANGE_PASSWORD } from "@/mutations/userMutations";
import FormWrapper from "../utilities/FormWrapper";
import FormInput from "../utilities/FormInput";
import FormInputInvalidMessage from "../utilities/FormInputInvalidMessage";
import FormSubmitButton from "../utilities/FormSubmitButton";
import FormHeader from "../utilities/FormHeader";
import SuccessMessage from "../utilities/SuccessMessage";

export default function ChangePasswordBody() {
  const {
    input: newPassword,
    inputIsValid: newPasswordIsValid,
    inputIsInvalid: newPasswordIsInvalid,
    inputChangeHandler: newPasswordChangeHandler,
    inputBlurHandler: newPasswordBlurHandler,
    setInput: newPasswordSetInput,
    setIsTouched: newPasswordSetIsTouched
  } = useInput((input) => input.length >= 6);

  const {
    input: confirmPassword,
    inputIsValid: confirmPasswordIsValid,
    inputIsInvalid: confirmPasswordIsInvalid,
    inputChangeHandler: confirmPasswordChangeHandler,
    inputBlurHandler: confirmPasswordBlurHandler,
    setInput: confirmPasswordSetInput,
  } = useInput((input) => input === newPassword);

  //need a check whether here on this component or the change password
  // component, if you don't have token, gtfo out of this page

  const params = useSearchParams();
  const token = params.get("token");
  console.log("token", params);
  const [changePassword, { loading }] = useMutation(CHANGE_PASSWORD, {
    variables: {
      changePasswordInput : {
        new_password: confirmPassword,
        token: token,
      }
    },
  });

  const [passwordChanged, setPasswordChanged] = useState(false);
  const [tokenExpired, setTokenExpired] = useState(false);

  const [genericError, setGenericError] = useState(false);
  const [versionError, setVersionError] = useState(false);
  const [rateLimitError, setRateLimitError] = useState(false);

  const changePasswordSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await changePassword();
      if (!result) {
        setGenericError(true);
        return;
      }
      if (result.errors && result.errors.length > 0) {
        const errorCode = result.errors[0].extensions?.code;

        switch (errorCode) {
          case "TOKEN_EXPIRED":
            setTokenExpired(true);
            break;
          case "VERSION_ERROR":
            setVersionError(true)
            break;
            case "RATE_LIMIT_ERROR":
            setRateLimitError(true)
            break;
          default:
            setGenericError(true);
        }
      } else if (result.data) {
        newPasswordSetInput("");
        confirmPasswordSetInput("");
        newPasswordSetIsTouched(false);
        setPasswordChanged(true);
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      setGenericError(true);
    }
  };

  return (
    <FormWrapper
      onSubmit={changePasswordSubmitHandler}
      genericError={genericError}
      versionError={versionError}
      rateLimitError={rateLimitError}
    >
      <FormHeader header="Change Password"></FormHeader>
      <FormInput
        inputIsInvalid={newPasswordIsInvalid}
        label="New Password"
        placeholder="At least 6 characters"
        onChangeHandler={newPasswordChangeHandler}
        onBlurHandler={newPasswordBlurHandler}
        type="password"
        value={newPassword}
      >
        <FormInputInvalidMessage
          inputIsInvalid={newPasswordIsInvalid}
          message="Minimum 6 characters."
        />
      </FormInput>
      <FormInput
        inputIsInvalid={confirmPasswordIsInvalid}
        label="Re-Enter New Password"
        placeholder="Passwords must match"
        onChangeHandler={confirmPasswordChangeHandler}
        onBlurHandler={confirmPasswordBlurHandler}
        type="password"
        value={confirmPassword}
      >
        <FormInputInvalidMessage
          inputIsInvalid={confirmPasswordIsInvalid}
          message="Passwords must match."
        />
      </FormInput>
      <FormSubmitButton
        formIsInvalid={!(newPasswordIsValid && confirmPasswordIsValid)}
        loading={loading}
        buttonText="Update Password"
      />
      <SuccessMessage showSuccessMessage={passwordChanged}>Password has been updated.</SuccessMessage>
      {tokenExpired && (
        <span className={styles["custom-error-message"]}>
          The link has expired. Please request a new link.
        </span>
      )}
    </FormWrapper>
  );
}
