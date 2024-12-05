import React, { ReactNode } from "react";
import styles from "./Error.module.scss";

interface ErrorProps {
  children: ReactNode;
}

export default function Error({ children }: ErrorProps) {
  return (
    <div className={styles["error-container"]}>
      <div className={styles["error"]}>{children}</div>
    </div>
  );
}
