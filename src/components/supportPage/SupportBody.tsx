import React, { useState, FormEvent } from "react";
import useInput from "../hooks/useInput";
import useTextAreaInput from "../hooks/useTextAreaInput";
import styles from "./SupportBody.module.scss";
import { useMutation } from "@apollo/client";
import { SUPPORT_FORM } from "@/mutations/contactMutations";
import FormWrapper from "../utilities/FormWrapper";
import FormInput from "../utilities/FormInput";
import FormTextArea from "../utilities/FormTextArea";
import FormInputInvalidMessage from "../utilities/FormInputInvalidMessage";
import FormSubmitButton from "../utilities/FormSubmitButton";
import FormHeader from "../utilities/FormHeader";
import SuccessMessage from "../utilities/SuccessMessage";

export default function SupportBody() {
  const {
    input: subject,
    inputIsValid: subjectIsValid,
    inputIsInvalid: subjectIsInvalid,
    inputChangeHandler: subjectChangeHandler,
    inputBlurHandler: subjectBlurHandler,
  } = useInput((input) => input.length > 0);

  const {
    input: textArea,
    inputIsValid: textAreaIsValid,
    inputIsInvalid: textAreaIsInvalid,
    inputChangeHandler: textAreaChangeHandler,
    inputBlurHandler: textAreaBlurHandler,
  } = useTextAreaInput((input) => input.length > 0);

  const [supportForm, { loading }] = useMutation(SUPPORT_FORM, {
    variables: {
      supportFormInput: {
        form_subject: subject,
        form_message: textArea,
      },
    },
    errorPolicy: "all"
  });

  const [emailSent, setEmailSent] = useState(false);

  const [genericError, setGenericError] = useState(false);
  const [versionError, setVersionError] = useState(false);
  const [rateLimitError, setRateLimitError] = useState(false);

  const supportSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await supportForm();
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
        setEmailSent(true);
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      setGenericError(true);
    }
  };

  return (
    <FormWrapper
      onSubmit={supportSubmitHandler}
      genericError={genericError}
      versionError={versionError}
      rateLimitError={rateLimitError}
    >
      <FormHeader header="Contact Form" />
      <span className={styles["sub-copy"]}>
        Use this form to contact us about any questions, issues, or feedback
        about your account
      </span>
      <FormInput
        inputIsInvalid={subjectIsInvalid}
        label="Subject"
        placeholder="subject"
        onChangeHandler={subjectChangeHandler}
        onBlurHandler={subjectBlurHandler}
        value={subject}
      >
        <FormInputInvalidMessage
          inputIsInvalid={subjectIsInvalid}
          message="Blank or invalid email format."
        />
      </FormInput>
      <FormTextArea
        inputIsInvalid={textAreaIsInvalid}
        label="Message"
        placeholder="Enter your message"
        onChangeHandler={textAreaChangeHandler}
        onBlurHandler={textAreaBlurHandler}
        value={textArea}
      >
        <FormInputInvalidMessage
          inputIsInvalid={textAreaIsInvalid}
          message="Message cannot be blank."
        />
      </FormTextArea>
      <FormSubmitButton
        formIsInvalid={!(subjectIsValid && textAreaIsValid)}
        loading={loading}
        buttonText="Send"
      />
      <SuccessMessage showSuccessMessage={emailSent}>
        Your message has been sent. You should receive an response from your
        email shortly.
      </SuccessMessage>
    </FormWrapper>
  );
}
