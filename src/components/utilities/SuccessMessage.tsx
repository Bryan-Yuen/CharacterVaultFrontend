import React from 'react'
import styles from "./SuccessMessage.module.scss";

interface SuccessMessageProps {
  showSuccessMessage: boolean;
  message: string;
}

export default function SuccessMessage({ showSuccessMessage, message} : SuccessMessageProps) {
  return (
    <>
    {showSuccessMessage && (
        <span className={styles["success-message"]}>
          {message}
        </span>
      )}
    </>
  )
}
