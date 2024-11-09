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
      newPassword: confirmPassword,
      token: token,
    },
    errorPolicy: "all",
  });

  const [passwordChanged, setPasswordChanged] = useState(false);
  const [genericError, setGenericError] = useState(false);
  const [tokenExpired, setTokenExpired] = useState(false);

  // consider try catch in future for network errors or some other mysterious error

  const changePasswordSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
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
        newPasswordSetInput("");
        confirmPasswordSetInput("");
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
      <SuccessMessage showSuccessMessage={passwordChanged} message="Password has been updated."/>
      {tokenExpired && (
        <span className={styles["custom-error-message"]}>
          The link has expired. Please request a new link.
        </span>
      )}
    </FormWrapper>
  );
}
