import React from "react";
import styles from "./FormInputInvalidMessage.module.scss";

interface FormInputInvalidMessageProps {
  inputIsInvalid: boolean;
  message: string;
}

export default function FormInputInvalidMessage({
  inputIsInvalid,
  message,
}: FormInputInvalidMessageProps) {
  return (
    inputIsInvalid ? (
      <span className={styles["invalid-message"]}>{message}</span>
    ) : null
  );
}
