import React, { ReactNode } from "react";
import styles from "./ErrorMessage.module.scss";

interface ErrorMessageProps {
  children: ReactNode;
}

export default function ErrorMessage({ children }: ErrorMessageProps) {
  return (
    <div className={styles["error-container"]}>
      <div className={styles["error"]}>{children}</div>
    </div>
  );
}
