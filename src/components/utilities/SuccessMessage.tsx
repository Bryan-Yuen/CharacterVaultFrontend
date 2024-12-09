import React, {ReactNode} from 'react'
import styles from "./SuccessMessage.module.scss";

interface SuccessMessageProps {
  showSuccessMessage: boolean;
  children: ReactNode;
}

export default function SuccessMessage({ showSuccessMessage, children} : SuccessMessageProps) {
  return (
    <>
    {showSuccessMessage && (
        <span className={styles["success-message"]}>
          {children}
        </span>
      )}
    </>
  )
}
