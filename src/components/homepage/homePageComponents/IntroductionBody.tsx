import React from "react";
import styles from "./IntroductionBody.module.scss";
import globalStyles from "@/sharedStyles/global-classes.module.scss";
import Image from "next/image";
import Link from "next/link";

export default function IntroductionBody() {
  return (
    <div className={styles["introduction-body-container"]}>
      <Image
        priority
        src="https://home-page-pictures.myfapsheet.com/dashboard-example.png"
        alt="dashboard"
        height={267}
        width={475}
        className={styles["dashboard-image"]}
      />
      <div className={styles["right-side-container"]}>
        <div className={styles["content-container"]}>
          <h2 className={styles["introduction-body-title"]}>
            Save your favorite pornstars here
          </h2>
          <span className={styles["introduction-body-content"]}>Create your list and add and manage your favorite pornstars with our interactive dashboard.</span>
          <Link
            href={"/register"}
            //className={styles["introduction-cta"]}
            className={`${globalStyles["blue-link-button"]} ${styles["button-alignment"]}`}
          >
            Create Your List
          </Link>
        </div>
      </div>
    </div>
  );
}
