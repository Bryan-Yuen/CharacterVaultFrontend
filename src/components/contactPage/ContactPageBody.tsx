import React, { useState, FormEvent } from "react";
import useInput from "../hooks/useInput";
import useTextAreaInput from "../hooks/useTextAreaInput";
import styles from "./ContactPageBody.module.scss";
import { useMutation } from "@apollo/client";
import { CONTACT_FORM } from "@/mutations/contactMutations";
import FormWrapper from "../utilities/FormWrapper";
import FormInput from "../utilities/FormInput";
import FormTextArea from "../utilities/FormTextArea";
import FormInputInvalidMessage from "../utilities/FormInputInvalidMessage";
import FormSubmitButton from "../utilities/FormSubmitButton";
import FormHeader from "../utilities/FormHeader";
import SuccessMessage from "../utilities/SuccessMessage";

export default function ContactPageBody() {
  const {
    input: contactEmail,
    inputIsValid: contactEmailIsValid,
    inputIsInvalid: contactEmailIsInvalid,
    inputChangeHandler: contactEmailChangeHandler,
    inputBlurHandler: contactEmailBlurHandler,
  } = useInput((input) => /^\S+@\S+\.\S+$/.test(input));

  const {
    input: textArea,
    inputIsValid: textAreaIsValid,
    inputIsInvalid: textAreaIsInvalid,
    inputChangeHandler: textAreaChangeHandler,
    inputBlurHandler: textAreaBlurHandler,
  } = useTextAreaInput((input) => input.length > 0);

  const [contactForm, { loading }] = useMutation(CONTACT_FORM, {
    variables: {
      contactFormInput: {
        form_email: contactEmail,
        form_message: textArea,
      },
    },
    errorPolicy: "all",
  });

  const [emailSent, setEmailSent] = useState(false);
  const [genericError, setGenericError] = useState(false);

  // consider try catch in future for network errors or some other mysterious error

  const contactSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const result = await contactForm();
      if (!result) {
        setGenericError(true);
        return;
      }
      if (result.errors && result.errors.length > 0) {
        setGenericError(true);
      } else if (result.data) {
        console.log("it worked");
        setEmailSent(true);
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      setGenericError(true);
    }
  };

  return (
    <FormWrapper onSubmit={contactSubmitHandler} genericError={genericError}>
      <FormHeader header="Contact Form"></FormHeader>
      <span className={styles["sub-copy"]}>
        Contact us for any questions related to your account or about our
        website
      </span>
      <FormInput
        inputIsInvalid={contactEmailIsInvalid}
        label="Email"
        placeholder="Enter your email"
        onChangeHandler={contactEmailChangeHandler}
        onBlurHandler={contactEmailBlurHandler}
        value={contactEmail}
      >
        <FormInputInvalidMessage
          inputIsInvalid={contactEmailIsInvalid}
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
        formIsInvalid={!(contactEmailIsValid && textAreaIsValid)}
        loading={loading}
        buttonText="Send"
      />
      <SuccessMessage
        showSuccessMessage={emailSent}
        message="Your message has been sent. You should receive an response from the
          email provided shortly."
      />
    </FormWrapper>
  );
}
