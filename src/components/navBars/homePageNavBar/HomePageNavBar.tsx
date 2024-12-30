import React from "react";
import styles from "./HomePageNavBar.module.scss";
import Link from "next/link";
import Image from "next/image";
import globalStyles from "@/sharedStyles/global-classes.module.scss";

export default function HomePageNavBar() {
  // make the icon into a component, just looks confusing
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
              alt="paper with droplets"
              height={0}
              width={0}
              className={styles["website-icon"]}
            />
            <div className={styles["website-name"]}>MyFapSheet</div>
          </Link>
          <div className={styles["login-sign-up-container"]}>
            <Link
              href={"/login"}
              className={styles["login-button"]}
            >
              Login
            </Link>
            <Link
              href={"/register"}
              className={`${globalStyles["blue-link-button"]} ${styles["sign-up-button"]}`}
            >
              Sign Up
            </Link>
          </div>
        </div>
    </nav>
  );
}
