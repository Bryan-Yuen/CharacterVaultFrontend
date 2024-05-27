import styles from "./OrderConfirmedBody.module.scss";
import Link from "next/link";

import React from "react";

export default function OrderConfirmedBody() {

  return (
    <div className={styles["container"]}>
      <div className={styles["content-container"]}>
        <h2 className={styles["thank-you-message"]}>Thank you for your purchase!</h2>
        <span className={styles["confirmation-email-message"]}>You should receive an order confirmation email shortly.</span>
        <span className={styles["call-to-action-message"]}>Start adding more pornstars now.</span>
        <Link
          href={"/dashboard"}
          className={styles["dashboard-link"]}
        >
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}
