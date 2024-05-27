import React from 'react'
import styles from "./CancelBody.module.scss";
import Link from "next/link";
import {  useMutation } from "@apollo/client";
import { CANCEL_SUBSCRIPTION } from "@/mutations/paymentMutation";
import { useRouter } from "next/router";

export default function CancelBody() {
    const router = useRouter();

    const [cancelSubscription] = useMutation(CANCEL_SUBSCRIPTION, {
        errorPolicy: "all",
      });
  

    const cancelSubscriptionHandler = async (e : React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
  
        const result = await cancelSubscription();
        if (result.errors) {
          console.log("there was errors");
          console.log(result);
          console.log(result.errors[0].extensions.code);
          // obviously put these code in a constant maybe in a file somewhere
        } else if (result.data) {
          console.log("it worked");
          console.log(result);
          router.push("/cancellation-confirmed");
        }
  
      };

  return (
    <div className={styles["container"]}>
    <div className={styles["content-container"]}>
      <h2 className={styles["thank-you-message"]}>We're sorry to see you go</h2>
      <span className={styles["confirmation-email-message"]}>You're about to downgrade back to the free basic plan,<br></br>
      which only allows you to add and edit up to 25 pornstars.
      </span>
      <span className={styles["confirmation-email-message"]}>Your pornstar data and images will still remain in your account.<br></br>
      However you will not be able to add or edit any pornstars unless<br></br>you remove enough pornstars to meet the 25 limit or resubscribe.
      </span>
      <span className={styles["call-to-action-message"]}>Are you sure you want to cancel?</span>
      <div className={styles["keep-cancel-buttons-container"]}>
          <Link
            href={"/dashboard"}
            className={styles["dashboard-link"]}
          >
            Keep subscription
          </Link>
          <button className={styles["cancel-button"]} onClick={cancelSubscriptionHandler}>Confirm cancellation</button>
      </div>
    </div>
  </div>
  )
}
