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
              src="/action-icon.svg"
              alt="clapperboard"
              height={0}
              width={0}
              className={styles["website-icon"]}
            />
            <div className={styles["website-name"]}>Character Vault</div>
          </Link>
          <div className={styles["login-sign-up-container"]}>
            <Link
              href={"/register"}
              className={`${globalStyles["blue-link-button"]} ${styles["demo-list-sign-up-button"]}`}
            >
              Create Your List
            </Link>
          </div>
        </div>
    </nav>
  );
}
