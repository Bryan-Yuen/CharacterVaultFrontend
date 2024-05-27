import styles from "./UpdatePaymentForm.module.scss";
import React, { useRef, useState, useEffect, FormEvent } from "react";
import useCreditCardInput from "../hooks/useCreditCardInput";
import useExpirationDateInput from "../hooks/useExpirationDateInput";
import useInput from "../hooks/useInput";
import { registerCursorTracker } from "cleave-zen";
import { UPDATE_PAYMENT } from "@/mutations/paymentMutation";
import { useMutation } from "@apollo/client";

export default function UpdatePaymentForm() {
    const inputRef = useRef(null);
    const {
      input: creditCardFormated,
      type: creditCardType,
      raw: creditCardRaw,
      inputIsValid: creditCardIsValid,
      inputIsInvalid: creditCardIsInvalid,
      inputChangeHandler: creditCardChangeHandler,
      inputBlurHandler: creditCardBlurHandler,
    } = useCreditCardInput((input) => input.length >= 0);
  
    const {
      input: expirationDate,
      inputIsValid: expirationDateIsValid,
      inputIsInvalid: expirationDateIsInvalid,
      inputChangeHandler: expirationDateChangeHandler,
      inputBlurHandler: expirationDateBlurHandler,
    } = useExpirationDateInput((input) => input.length >= 0);
  
    const {
      input: securityCode,
      inputIsValid: securityCodeIsValid,
      inputIsInvalid: securityCodeIsInvalid,
      inputChangeHandler: securityCodeChangeHandler,
      inputBlurHandler: securityCodeBlurHandler,
    } = useInput((input) => input.length >= 0);
  
    const {
      input: zipCode,
      inputIsValid: zipCodeIsValid,
      inputIsInvalid: zipCodeIsInvalid,
      inputChangeHandler: zipCodeChangeHandler,
      inputBlurHandler: zipCodeBlurHandler,
    } = useInput((input) => input.length >= 0);

    const [sendPayment] = useMutation(UPDATE_PAYMENT, {
        variables: {
          payment: {
            cardNumber: creditCardRaw,
            expirationDate: expirationDate,
            securityCode: securityCode,
            zipCode: zipCode
          },
        },
        errorPolicy: "all",
      });

    useEffect(() => {
        const inputElement = inputRef.current;
        if (inputElement) {
          // Call this in return to make sure it is unregistered when the component unmounts
          return registerCursorTracker({ input: inputElement, delimiter: "*" });
        }
      }, [registerCursorTracker]);

      const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const result = await sendPayment();
    if (result.errors) {
      console.log("there was errors");
      console.log(result);
      console.log(result.errors[0].extensions.code);
      // obviously put these code in a constant maybe in a file somewhere
    } else if (result.data) {
      console.log("it worked");
      console.log(result);
    }
      };

  return (
    <form
            className={styles["form-container"]}
            id="myform"
            onSubmit={submitHandler}
          >
            <h3>Enter New Payment Details</h3>
            <div className={styles["input-container"]}>
              <label>Card Number</label>
              <input
                ref={inputRef}
                value={creditCardFormated}
                onChange={creditCardChangeHandler}
                onBlur={creditCardBlurHandler}
              />
            </div>
            <div className={styles["two-input-container"]}>
              <div className={styles["input-container"]}>
                <label>Expiration Date</label>
                <input
                  value={expirationDate}
                  onChange={expirationDateChangeHandler}
                  onBlur={expirationDateBlurHandler}
                />
              </div>
              <div className={styles["input-container"]}>
                <label>Security Code</label>
                <input
                  maxLength={3}
                  onChange={securityCodeChangeHandler}
                  onBlur={securityCodeBlurHandler}
                ></input>
              </div>
            </div>
            <div className={styles["two-input-container"]}>
              <div className={styles["input-container"]}>
                <label>Country</label>
                <input></input>
              </div>
              <div className={styles["input-container"]}>
                <label>Billing Zip Code</label>
                <input onChange={zipCodeChangeHandler}
                  onBlur={zipCodeBlurHandler}></input>
              </div>
            </div>
            <button>Submit</button>
          </form>
  )
}
