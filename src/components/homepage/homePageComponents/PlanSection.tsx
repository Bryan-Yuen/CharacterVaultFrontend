import React from "react";
import styles from "./PlanSection.module.scss";
import globalStyles from "@/sharedStyles/global-classes.module.scss";
import Link from "next/link";
import Image from "next/image";

export default function PlanSection() {
  return (
    <div className={styles["plan-section-container"]}>
      <h2 className={styles["plan-title"]}>Try for free, upgrade anytime</h2>
        <div className={styles["plans-row"]}>
          <div className={styles["plan-container"]}>
              <h3 className={styles["header"]}>Basic</h3>
              <div className={styles["price"]}>Free</div>
              <Image
              priority
              src="/MyFapSheetSVG.svg"
              alt="Down Icon"
              height={0}
              width={50}
              className={styles["website-icon"]}
            />
              <div>Add up to 25 pornstars</div>
              <Link
            href={"/register"}
            className={`${globalStyles["blue-link-button"]} ${styles["plan-cta"]}`}
          >
            Create Your List
          </Link>
          </div>
          <div className={styles["plan-container"]}>
              <h3 className={styles["header"]}>Premium</h3>
              <div className={styles["price"]}>$3.99/month</div>
              <Image
              priority
              src="/MyFapSheetSVG.svg"
              alt="Down Icon"
              height={0}
              width={65}
              className={styles["website-icon"]}
            />
              <div>Add up to 1000 pornstars</div>
              <Link
            href={"/register"}
            className={`${globalStyles["blue-link-button"]} ${styles["plan-cta"]}`}
          >
            Create Your List
          </Link>
          </div>
        </div>
    </div>
  );
}
