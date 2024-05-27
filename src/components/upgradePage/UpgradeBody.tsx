import styles from "./UpgradeBody.module.scss";
import useCreditCardInput from "../hooks/useCreditCardInput";
import useExpirationDateInput from "../hooks/useExpirationDateInput";
import useInput from "../hooks/useInput";
import { useMutation } from "@apollo/client";
import { SEND_PAYMENT } from "@/mutations/paymentMutation";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useApolloClient } from "@apollo/client";

import React, { useRef, useState, useEffect, FormEvent } from "react";
import { registerCursorTracker } from "cleave-zen";

export default function UpgradeBody() {
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

  const router = useRouter();
  const client = useApolloClient();

  const [sendPayment] = useMutation(SEND_PAYMENT, {
    variables: {
      payment: {
        cardNumber: creditCardRaw,
        expirationDate: expirationDate,
        securityCode: securityCode,
        zipCode: zipCode,
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
    try {
      const result = await sendPayment();
      if (result.errors) {
        console.log("there were errors");
        console.log(result);
        console.log(result.errors[0].extensions.code);
        // Handle errors if needed
      } else if (result.data) {
        console.log("it worked");
        // Wait for refetchQueries to complete before redirecting
        await client.refetchQueries({
          include: ["CheckSubscription"],
        });
        console.log(result);
        router.push("/order-confirmed");
      }
    } catch (error) {
      console.error("An error occurred during payment:", error);
      // Handle errors if needed
    }
  };
  

  return (
    <div className={styles["container"]}>
      <div className={styles["left-side"]}>
        <div className={styles["checkout-container"]}>
          <h2 className={styles["checkout-title"]}>Checkout</h2>
          <h3 className={styles["premium-plan-title"]}>Premium Plan</h3>
          <span className={styles["premium-plan-copy"]}>Add up to 1000 pornstars</span>
          <form
            className={styles["form-container"]}
            id="myform"
            onSubmit={submitHandler}
          >
            <div className={styles["credit-card-header-images-container"]}>
              <span className={styles["form-title"]}>
                Enter Card Details
                </span>
                <div className={styles["credit-card-images-container"]}>
                  <Image priority src={"/visa.png"} width={40} height={0} alt="visa"></Image>
                  <Image priority src={"/mastercard.png"} width={40} height={0} alt="mastercard"></Image>
                  <Image priority src={"/american-express.png"} width={40} height={0} alt="american-express"></Image>
                  <Image priority src={"/discover.png"} width={40} height={0} alt="discover"></Image>
                </div>
            </div>
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
              <div className={`${styles["security-code-container"]} ${styles["input-container"]}`}>
                <label>Security Code</label>
                <input
                  maxLength={3}
                  onChange={securityCodeChangeHandler}
                  onBlur={securityCodeBlurHandler}
                ></input>
              </div>
            </div>
            <div className={styles["two-input-container"]}>
              <div className={`${styles["country-container"]} ${styles["input-container"]}`}>
                <label>Country</label>
                <span className={styles["united-states"]}>United States</span>
              </div>
              <div className={`${styles["zip-code-container"]} ${styles["input-container"]}`}>
                <label>Billing Zip Code</label>
                <input
                  onChange={zipCodeChangeHandler}
                  onBlur={zipCodeBlurHandler}
                ></input>
              </div>
            </div>
          </form>
          <span className={styles["disclaimer-copy"]}>*We are only accepting U.S. cards at this time</span>
        </div>
      </div>
      <div className={styles["right-side"]}>
        <div className={styles["summary-container"]}>
          <h2 className={styles["summary-title"]}>Summary</h2>
          <div className={styles["item-container"]}>
            <span>Premium Plan Monthly Subscription</span>
          </div>
          <div className={styles["subtotal-container"]}>
            <span>Subtotal</span>
            <span>$3.99</span>
          </div>
          <div className={styles["tax-container"]}>
            <span>Tax</span>
            <span>$0.00</span>
          </div>
          <div className={styles["total-container"]}>
            <span>Total Due Today</span>
            <span>$3.99</span>
          </div>
          <p className={styles["agreement-copy"]}>
            You will be charged $3.99 monthly until you cancel your
            subscription. By clicking "Start subscription" you agree to our
            terms and authorize this recurring charge.
          </p>
          <div>
            <button
              className={styles["purchase-button"]}
              type="submit"
              form="myform"
            >
              Subscribe Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
