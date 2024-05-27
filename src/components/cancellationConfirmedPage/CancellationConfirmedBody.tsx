import React from 'react'
import styles from "./CancellationConfirmedBody.module.scss";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { CHECK_SUBSCRIPTION } from "@/queries/subscription";

enum Subscription_Status {
    ACTIVE_SUBSCRIPTION = "ACTIVE_SUBSCRIPTION",
    NO_SUBSCRIPTION = "NO_SUBSCRIPTION",
    CANCELLING_SUBSCRIPTION = "CANCELLING_SUBSCRIPTION",
  }

export default function CancellationConfirmedBody() {
    const { loading, error, data } = useQuery(
        CHECK_SUBSCRIPTION
      );

      if (loading) return <div>Loading...</div>;
      if (error) return <div>Error! {error.message}</div>;
  return (
    <div className={styles["container"]}>
    <div className={styles["content-container"]}>
      <h2 className={styles["thank-you-message"]}>Cancellation Confirmation</h2>
      <span className={styles["confirmation-email-message"]}>Your subscription will remain active until the current billing period.<br></br>
      If you change your mind and want to continue your subscription,<br></br>you may do so at anytime by going on the account settings page<br></br>and click "Keep subscription"
      </span>
      {data.checkSubscription.subscription_status ===
            Subscription_Status.CANCELLING_SUBSCRIPTION && (
              <span>Your subscription will end on: {new Date(data.checkSubscription.subscription_end_date).toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'})}</span>
          )}
      <Link
        href={"/dashboard"}
        className={styles["dashboard-link"]}
      >
        Go to dashboard
      </Link>
    </div>
  </div>
  )
}
