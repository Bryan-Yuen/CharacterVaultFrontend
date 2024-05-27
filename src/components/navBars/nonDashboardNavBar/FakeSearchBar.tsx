import React, { useEffect, useRef } from "react";
import styles from "./FakeSearchBar.module.scss";
import Link from "next/link";

export default function FakeSearchBar() {
  return (
    <Link href={"/dashboard"} className={styles['header']}>
      <div className={`${styles["search-input-container"]}`}>
        <input
          type="text"
          className={styles["search-input"]}
          placeholder="Filter by tags or Search by Name"
          readOnly
        />
        <div className={styles["checkbox"]}>
          <input type="checkbox" />
          <label>
            <span></span>
          </label>
        </div>
      </div>
    </Link>
  );
}
