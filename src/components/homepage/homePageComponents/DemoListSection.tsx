import React from "react";
import styles from "./DemoListSection.module.scss";
import Link from "next/link";

export default function DemoListSection() {
  return (
    <div className={styles["demo-list-body-container"]}>
      <h2 className={styles["demo-list-body-title"]}>Check out a demo list</h2>
      {/*lets do different color for this*/}
      {/*page scrolls up when pressing back button from another link, and its probably because of prefetch when links come into viewport*/}
      <Link
        href={"/demo-list"}
        className={`${styles["view-demo-list-cta"]}`}
        prefetch={false}
      >
        View Demo List
      </Link>
    </div>
  );
}
