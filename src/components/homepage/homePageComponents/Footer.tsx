import React from "react";
import styles from "./Footer.module.scss";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className={styles["footer-container"]}>
      <div className={styles["links-container"]}>
        <Link href={"/privacy-policy"} className={styles["footer-item"]}>
          Privacy Policy
        </Link>
        <Link href={"/terms-of-service"} className={styles["footer-item"]}>
          Terms of Service
        </Link>
        <Link href={"/contact"} className={styles["footer-item"]}>
          Contact
        </Link>
      </div>
      <div className={styles["copyright"]}>&copy; 2024 MyFapSheet</div>
    </footer>
  );
}
