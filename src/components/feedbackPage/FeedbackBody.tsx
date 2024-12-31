import React, { useState, FormEvent } from "react";
import useInput from "../hooks/useInput";
import useTextAreaInput from "../hooks/useTextAreaInput";
import styles from "./FeedbackBody.module.scss";
import { useMutation } from "@apollo/client";
import { FEEDBACK_FORM } from "@/mutations/contactMutations";
import FormWrapper from "../utilities/FormWrapper";
import FormInput from "../utilities/FormInput";
import FormTextArea from "../utilities/FormTextArea";
import FormInputInvalidMessage from "../utilities/FormInputInvalidMessage";
import FormSubmitButton from "../utilities/FormSubmitButton";
import FormHeader from "../utilities/FormHeader";
import SuccessMessage from "../utilities/SuccessMessage";

export default function FeedbackBody() {
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

  const [feedbackForm, { loading }] = useMutation(FEEDBACK_FORM, {
    variables: {
      feedbackFormInput: {
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

  const feedbackSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await feedbackForm();
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
      onSubmit={feedbackSubmitHandler}
      genericError={genericError}
      versionError={versionError}
      rateLimitError={rateLimitError}
    >
      <FormHeader header="Feedback Form" />
      <span className={styles["sub-copy"]}>
        Use this form to provide any feedback or ask questions about features on the website. We always appreaciate any feedback and will consider improving based on it.
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
          message="Subject cannot be blank."
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
        Your message has been sent. You should receive an response in your
        email shortly.
      </SuccessMessage>
    </FormWrapper>
  );
}
