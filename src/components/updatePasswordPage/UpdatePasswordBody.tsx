import React, { FormEvent, useState } from "react";
import useInput from "../hooks/useInput";
//import styles from "./UpdatePasswordBody.module.scss";
import { useMutation } from "@apollo/client";
import { CHANGE_PASSWORD_LOGGED_IN } from "@/mutations/userMutations";
import FormWrapper from "../utilities/FormWrapper";
import FormInput from "../utilities/FormInput";
import FormInputInvalidMessage from "../utilities/FormInputInvalidMessage";
import FormSubmitButton from "../utilities/FormSubmitButton";
import FormHeader from "../utilities/FormHeader";
import SuccessMessage from "../utilities/SuccessMessage";

export default function UpdatePasswordBody() {
  const {
    input: currentPassword,
    inputIsValid: currentPasswordIsValid,
    inputIsInvalid: currentPasswordIsInvalid,
    inputChangeHandler: currentPasswordChangeHandler,
    inputBlurHandler: currentPasswordBlurHandler,
    setInput: currentPasswordSetInput,
    setIsTouched: currentPasswordSetIsTouched,
  } = useInput((input) => input.length > 0);

  const {
    input: newPassword,
    inputIsValid: newPasswordIsValid,
    inputIsInvalid: newPasswordIsInvalid,
    inputChangeHandler: newPasswordChangeHandler,
    inputBlurHandler: newPasswordBlurHandler,
    setInput: newPasswordSetInput,
    setIsTouched: newPasswordSetIsTouched,
  } = useInput((input) => input.length >= 6);

  const {
    input: confirmNewPassword,
    inputIsValid: confirmNewPasswordIsValid,
    inputIsInvalid: confirmNewPasswordIsInvalid,
    inputChangeHandler: confirmNewPasswordChangeHandler,
    inputBlurHandler: confirmNewPasswordBlurHandler,
    setInput: confirmNewPasswordSetInput,
    setIsTouched: confirmNewPasswordSetIsTouched,
  } = useInput((input) => input === newPassword);

  const [changePasswordLoggedIn, { loading }] = useMutation(
    CHANGE_PASSWORD_LOGGED_IN,
    {
      variables: {
        changePasswordLoggedInInput: {
          current_password: currentPassword,
          new_password: confirmNewPassword,
        },
      },
      errorPolicy: "all",
    }
  );

  const [passwordChanged, setPasswordChanged] = useState(false);

  const [genericError, setGenericError] = useState(false);
  const [versionError, setVersionError] = useState(false);
  const [rateLimitError, setRateLimitError] = useState(false);

  const updatePasswordSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await changePasswordLoggedIn();
      if (!result) {
        setGenericError(true);
        return;
      }
      if (result.errors && result.errors.length > 0) {
        const errorCode = result.errors[0].extensions?.code;

        switch (errorCode) {
          case "VERSION_ERROR":
            setVersionError(true);
            break;
          case "RATE_LIMIT_ERROR":
            setRateLimitError(true);
            break;
          default:
            setGenericError(true);
        }
      } else if (result.data) {
        // resets input fields
        currentPasswordSetInput("");
        newPasswordSetInput("");
        confirmNewPasswordSetInput("");
        currentPasswordSetIsTouched(false);
        newPasswordSetIsTouched(false);
        confirmNewPasswordSetIsTouched(false);
        setPasswordChanged(true);
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      setGenericError(true);
    }
  };

  return (
    <FormWrapper
      onSubmit={updatePasswordSubmitHandler}
      genericError={genericError}
      versionError={versionError}
      rateLimitError={rateLimitError}
    >
      <FormHeader header="Update Password" />
      <FormInput
        inputIsInvalid={currentPasswordIsInvalid}
        label="Current Password"
        placeholder="At least 6 characters"
        onChangeHandler={currentPasswordChangeHandler}
        onBlurHandler={currentPasswordBlurHandler}
        type="password"
        value={currentPassword}
      >
        <FormInputInvalidMessage
          inputIsInvalid={currentPasswordIsInvalid}
          message="Current Password required."
        />
      </FormInput>
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
        inputIsInvalid={confirmNewPasswordIsInvalid}
        label="Re-Enter New Password"
        placeholder="Passwords must match"
        onChangeHandler={confirmNewPasswordChangeHandler}
        onBlurHandler={confirmNewPasswordBlurHandler}
        type="password"
        value={confirmNewPassword}
      >
        <FormInputInvalidMessage
          inputIsInvalid={confirmNewPasswordIsInvalid}
          message="Passwords must match."
        />
      </FormInput>
      <FormSubmitButton
        formIsInvalid={
          !(
            confirmNewPasswordIsValid &&
            newPasswordIsValid &&
            currentPasswordIsValid
          )
        }
        loading={loading}
        buttonText="Save"
      />
      <SuccessMessage showSuccessMessage={passwordChanged}>
        Password has been updated.
      </SuccessMessage>
    </FormWrapper>
  );
}
