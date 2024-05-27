import React, { useState,  FormEvent } from 'react';
import useInput from '../hooks/useInput';
import useTextAreaInput from '../hooks/useTextAreaInput';
import styles from './ContactPageBody.module.scss';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation'
import { CONTACT_FORM } from '@/mutations/userMutations';

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
  } = useTextAreaInput((input) => /^\S+@\S+\.\S+$/.test(input));

  
  const [contactForm] = useMutation(CONTACT_FORM, {
    variables: {
        message: textArea,
        email: contactEmail,
      },
    errorPolicy: "all"
  });

  const [uniqueUsernameIsInvalid, setUniqueUsernameIsInvalid] = useState(false)
  const [uniqueEmailIsInvalid, setUniqueEmailIsInvalid] = useState(false)

  const router = useRouter()
  // consider try catch in future for network errors or some other mysterious error

  const registerSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("gay")
    const result = await contactForm()
    if (result.errors)
    {
      console.log("there was errors")
      console.log(result)
      console.log(result.errors[0].extensions.code)
      // obviously put these code in a constant maybe in a file somewhere
      if (result.errors[0].extensions.code === "EMAIL_EXISTS_AND_USERNAME_TAKEN")
      {
        setUniqueUsernameIsInvalid(true)
        setUniqueEmailIsInvalid(true)
      }
    }
    else if (result.data)
    {
      console.log("it worked")
      //router.push("/dashboard")
    }
   
  };

  const emailIsInvalidClass = contactEmailIsInvalid || uniqueEmailIsInvalid ? 'invalid' : '';


  return (
    <div className={styles['register-body']}>
      <form onSubmit={registerSubmitHandler} className={styles["form-container"]}>
        <span className={styles['header']}>Contact Form</span>
        <span className={styles['sub-copy']}>Contact us for any questions related to your account or about the website</span>
        <div
          className={`${styles['input-container']} ${styles[emailIsInvalidClass]}`}
        >
          <label>Email</label>
          <input
            placeholder="Enter your email"
            onChange={contactEmailChangeHandler}
            onBlur={contactEmailBlurHandler}
            type="text"
          />
          {contactEmailIsInvalid && (
            <span className={styles['invalid-message']}>
              Invalid Email format.
            </span>
          )}
          {uniqueEmailIsInvalid && (
            <span className={styles['invalid-message']}>
              Email is already registered.
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
        </div>
        <div className={styles['sign-up-button-container']}>
          <button disabled={uniqueEmailIsInvalid} className={styles['sign-up-button']}>Send</button>
        </div>
      </form>
    </div>
  );
}
