import React, { FormEvent, ReactNode } from "react";
import styles from "./Modal.module.scss";

interface ModalProps {
  children: ReactNode;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  header: string;
  genericError: boolean;
  versionError: boolean;
  rateLimitError: boolean;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export default function Modal({
  children,
  setModal,
  header,
  genericError,
  versionError,
  rateLimitError,
  onSubmit,
}: ModalProps) {
  return (
    <div className={styles["backdrop"]} onClick={() => setModal(false)}>
      <div className={styles["modal"]} onClick={(e) => e.stopPropagation()}>
        <div className={styles["modal-header"]}>
          <div className={styles["modal-title"]}>{header}</div>
          <button onClick={() => setModal(false)} className={styles["close"]}>
            &#10006;
          </button>
        </div>
        <form onSubmit={onSubmit} className={styles["form-container"]}>
          {children}
          {genericError && (
            <span className={styles["server-error-message"]}>
              Server Error. Please Refresh Page or try again later.
            </span>
          )}
          {versionError && (
            <span className={styles["server-error-message"]}>
              Version Error. A new web version is available. Please save your
              data and refresh the page and try again.
            </span>
          )}
          {rateLimitError && (
            <span className={styles["server-error-message"]}>
              Too many requests for this action. Please wait and try again again
              later. Contact support if you think this is was an error.
            </span>
          )}
        </form>
      </div>
    </div>
  );
}
