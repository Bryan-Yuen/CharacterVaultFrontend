import React, { useState, FormEvent, useEffect } from "react";
import useInput from "../hooks/useInput";
//import styles from "./ChangeEmailBody.module.scss";
import { useMutation } from "@apollo/client";
import { CHANGE_EMAIL } from "@/mutations/userMutations";
import FormWrapper from "../utilities/FormWrapper";
import FormInput from "../utilities/FormInput";
import FormInputInvalidMessage from "../utilities/FormInputInvalidMessage";
import FormSubmitButton from "../utilities/FormSubmitButton";
import FormHeader from "../utilities/FormHeader";
import SuccessMessage from "../utilities/SuccessMessage";

export default function ChangeEmailBody() {
  const {
    input: newEmail,
    inputIsValid: newEmailIsValid,
    inputIsInvalid: newEmailIsInvalid,
    inputChangeHandler: newEmailChangeHandler,
    inputBlurHandler: newEmailBlurHandler,
  } = useInput((input) => /^\S+@\S+\.\S+$/.test(input));

  // clears the error message the user starts typing again
  useEffect(() => {
    if (uniqueEmailIsInvalid) setUniqueEmailIsInvalid(false);
  }, [newEmail]);

  const [uniqueEmailIsInvalid, setUniqueEmailIsInvalid] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [genericError, setGenericError] = useState(false);

  const [changeEmail, { loading }] = useMutation(CHANGE_EMAIL, {
    variables: {
      changeEmailInput : {
        user_email: newEmail,
      }
    },
    errorPolicy: "all",
  });

  // consider try catch in future for network errors or some other mysterious error
  const changeEmailSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await changeEmail();
      if (!result) {
        setGenericError(true);
        return;
      }
      if (result.errors && result.errors.length > 0) {
        // obviously put these code in a constant maybe in a file somewhere
        if (result.errors[0].extensions.code === "EMAIL_EXISTS") {
          setUniqueEmailIsInvalid(true);
        } else setGenericError(true);
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
      onSubmit={changeEmailSubmitHandler}
      genericError={genericError}
    >
      <FormHeader header="Update Email" />
      <FormInput
        inputIsInvalid={newEmailIsInvalid || uniqueEmailIsInvalid}
        label="New Email"
        placeholder="example@mail.com"
        onChangeHandler={newEmailChangeHandler}
        onBlurHandler={newEmailBlurHandler}
      >
        <FormInputInvalidMessage
          inputIsInvalid={newEmailIsInvalid}
          message="Blank or invalid email format."
        />
        <FormInputInvalidMessage
          inputIsInvalid={uniqueEmailIsInvalid}
          message="Email is already registered."
        />
      </FormInput>
      <FormSubmitButton
        formIsInvalid={!newEmailIsValid}
        loading={loading}
        buttonText="Save"
      />
      <SuccessMessage
        showSuccessMessage={emailSent}
        message="An email has been sent to the new email address provided. Please click on
          the link to confirm the email address update."
      />
    </FormWrapper>
  );
}
