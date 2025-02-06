import React from "react";
import styles from "./MiddleMessage.module.scss";

export default function MiddleMessage() {
  return (
    <div className={styles["middle-message-container"]}>
      <h2 className={styles["middle-message-title"]}>Customize your way</h2>
      <span className={styles["middle-message-content"]}>
        Have an character picture you like? Upload your own and add your
        own tags.
      </span>
    </div>
  );
}
