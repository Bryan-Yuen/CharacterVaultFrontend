import React, { useState, FormEvent } from "react";
import useInput from "../hooks/useInput";
import useTextAreaInput from "../hooks/useTextAreaInput";
import styles from "./ContactPageBody.module.scss";
import { useMutation } from "@apollo/client";
import { CONTACT_FORM } from "@/mutations/userMutations";
import { RotatingLines } from "react-loader-spinner";

export default function ContactPageBody() {
  const {
    input: contactEmail,
    inputIsValid: contactEmailIsValid,
    inputIsInvalid: contactEmailIsInvalid,
    inputChangeHandler: contactEmailChangeHandler,
    inputBlurHandler: contactEmailBlurHandler,
    setInput: contactEmailSetInput
  } = useInput((input) => /^\S+@\S+\.\S+$/.test(input));

  const {
    input: textArea,
    inputIsValid: textAreaIsValid,
    inputIsInvalid: textAreaIsInvalid,
    inputChangeHandler: textAreaChangeHandler,
    inputBlurHandler: textAreaBlurHandler,
    setInput: textAreaSetInput
  //} = useTextAreaInput((input) => /^\S+@\S+\.\S+$/.test(input));
} = useTextAreaInput((input) => input.length > 0);

  const [contactForm, { loading }] = useMutation(CONTACT_FORM, {
    variables: {
      message: textArea,
      email: contactEmail,
    },
    errorPolicy: "all",
  });

  const [emailSent, setEmailSent] = useState(false);
  const [genericError, setGenericError] = useState(false);

  // consider try catch in future for network errors or some other mysterious error

  const registerSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
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
        contactEmailSetInput("")
        textAreaSetInput("")
        setEmailSent(true)
        //router.push("/dashboard")
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      setGenericError(true);
    }
  };

  const emailIsInvalidClass = contactEmailIsInvalid ? "invalid" : "";

  const messageIsInvalidClass = textAreaIsInvalid ? "invalid" : "";
  console.log("what is area",textAreaIsInvalid)

  return (
    <main className={styles["register-body"]}>
      <form
        onSubmit={registerSubmitHandler}
        className={styles["form-container"]}
      >
        <span className={styles["header"]}>Contact Form</span>
        <span className={styles["sub-copy"]}>
          Contact us for any questions related to your account or about the
          website
        </span>
        <div
          className={`${styles["input-container"]} ${styles[emailIsInvalidClass]}`}
        >
          <label>Email</label>
          <input
            placeholder="Enter your email"
            onChange={contactEmailChangeHandler}
            onBlur={contactEmailBlurHandler}
            type="text"
          />
          {contactEmailIsInvalid && (
            <span className={styles["invalid-message"]}>
              Blank or invalid Email format.
            </span>
          )}
        </div>
        <div
          className={`${styles["input-container"]} ${styles[messageIsInvalidClass]}`}
        >
          <label>Message</label>
          <textarea
            placeholder="Enter your message"
            rows={4}
            onChange={textAreaChangeHandler}
            onBlur={textAreaBlurHandler}
          />
          {textAreaIsInvalid && (
            <span className={styles["invalid-message"]}>
              Message cannot be blank.
            </span>
          )}
        </div>
        <div className={styles["sign-up-button-container"]}>
          <button
            disabled={!(contactEmailIsValid && textAreaIsInvalid) || loading}
            className={styles["sign-up-button"]}
          >
            {loading ? (
              <RotatingLines
                visible={true}
                width="25"
                strokeWidth="5"
                strokeColor="white"
                animationDuration="0.75"
                ariaLabel="rotating-lines-loading"
              />
            ) : (
              "Send"
            )}
          </button>
        </div>
        {emailSent && (
          <span className={styles["success-message"]}>
            Your message has been sent. You should receive an response from the email provided shortly.
          </span>
        )}
        {genericError && (
          <span className={styles["server-error-message"]}>
            Server Error. Please Refresh Page or try again later.
          </span>
        )}
      </form>
    </main>
  );
}
