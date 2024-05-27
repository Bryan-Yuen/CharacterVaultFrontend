import React, { useState,  FormEvent } from 'react';
import useInput from '../hooks/useInput';
import useTextAreaInput from '../hooks/useTextAreaInput';
import styles from './SupportBody.module.scss';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation'
import { CONTACT_FORM } from '@/mutations/userMutations';
import { SUPPORT_FORM } from '@/mutations/userMutations';

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

  
  const [supportForm] = useMutation(SUPPORT_FORM, {
    variables: {
        message: textArea,
        subject: subject,
      },
    errorPolicy: "all"
  });

  const router = useRouter()
  // consider try catch in future for network errors or some other mysterious error

  const registerSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("gay")
    const result = await supportForm()
    if (result.errors)
    {
      console.log("there was errors")
      console.log(result)
      console.log(result.errors[0].extensions.code)
      // obviously put these code in a constant maybe in a file somewhere
    }
    else if (result.data)
    {
      console.log("it worked")
      //router.push("/dashboard")
    }
   
  };

  const emailIsInvalidClass = subjectIsInvalid ? 'invalid' : '';


  return (
    <div className={styles['register-body']}>
      <form onSubmit={registerSubmitHandler} className={styles["form-container"]}>
        <span className={styles['header']}>Support contact form</span>
        <span className={styles['sub-copy']}>Use this form to contact us about any questions, issues, or feedback about your account</span>
        <div
          className={`${styles['input-container']} ${styles[emailIsInvalidClass]}`}
        >
          <label>Subject</label>
          <input
            placeholder="Subject"
            type="text"
            onChange={subjectChangeHandler}
            onBlur={subjectBlurHandler}
          />
                    {subjectIsInvalid && (
            <span className={styles['invalid-message']}>
              Invalid Email format.
            </span>
          )}
        </div>
        <div
          className={`${styles['input-container']} ${styles[emailIsInvalidClass]}`}
        >
          <label>Message</label>
          <textarea
            placeholder="Enter your message"
            rows={3}
            onChange={textAreaChangeHandler}
            onBlur={textAreaBlurHandler}
          />
                    {textAreaIsInvalid && (
            <span className={styles['invalid-message']}>
              Can't be blank.
            </span>
          )}
        </div>
        <div className={styles['sign-up-button-container']}>
          <button disabled={textAreaIsInvalid} className={styles['sign-up-button']}>Send</button>
        </div>
      </form>
    </div>
  );
}
