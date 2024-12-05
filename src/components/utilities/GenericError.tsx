import React from "react";
import styles from "./GenericError.module.scss";

interface GenericErrorProps {
  genericError: boolean;
}

export default function GenericError({ genericError }: GenericErrorProps) {
  return (
    <>
      {genericError && (
        <span className={styles["server-error-message"]}>
          Server Error. Please Refresh Page or try again later.
        </span>
      )}
    </>
  );
}
