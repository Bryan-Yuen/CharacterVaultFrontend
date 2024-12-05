import React, { FormEvent, ReactNode } from "react";
import styles from "./FormWrapper.module.scss";

interface FormWrapperProps {
  children: ReactNode;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  genericError: boolean;
  versionError: boolean;
  rateLimitError: boolean;
  marginTop?: string;
}

export default function FormWrapper({ children, onSubmit, genericError, versionError, rateLimitError, marginTop = "3%" } : FormWrapperProps) {
  return (
    <main className={styles["form-container"]}>
      <form onSubmit={onSubmit} className={styles["form-body"]} style={{marginTop}}>
        {children}
        {genericError && (
          <span className={styles["server-error-message"]}>
            Server Error. Please Refresh Page or try again later.
          </span>
        )}
              {versionError && (
        <span className={styles["server-error-message"]}>
          Version Error. A new web version is available. Please save your data and refresh the page and try again.
        </span>
      )}
      {rateLimitError && (
        <span className={styles["server-error-message"]}>
          Too many requests for this action. Please wait and try again again later. Contact support if you think this is was an error.
        </span>
      )}
      </form>
    </main>
  );
};