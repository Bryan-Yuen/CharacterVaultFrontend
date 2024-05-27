import React from "react";
import styles from "./DemoListNavbar.module.scss";
import Link from "next/link";
import Image from "next/image";
import globalStyles from "@/sharedStyles/global-classes.module.scss";

export default function DemoListNavbar() {
  return (
    <nav className={styles["navbar"]}>
        <div className={styles["navbar-container"]}>
          <Link
            href={"/"}
            className={`${styles["header"]} ${styles["website-name-and-icon-container"]}`}
          >
            {" "}
            <Image
              priority
              src="/MyFapSheetSVG.svg"
              alt="Down Icon"
              height={0}
              width={32}
              className={styles["website-icon"]}
            />
            <h1 className={styles["website-name"]}>MyFapSheet</h1>
          </Link>
          <div className={styles["login-sign-up-container"]}>
            <Link
              href={"/register"}
              className={`${globalStyles["blue-link-button"]} ${styles["sign-up"]}`}
            >
              Create Your List
            </Link>
          </div>
        </div>
    </nav>
  );
}
