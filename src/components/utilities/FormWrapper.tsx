import React, { FormEvent, ReactNode } from "react";
import styles from "./FormWrapper.module.scss";

interface FormWrapperProps {
  children: ReactNode;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  genericError: boolean;
  marginTop?: string;
}

export default function FormWrapper({ children, onSubmit, genericError, marginTop = "3%" } : FormWrapperProps) {
  return (
    <main className={styles["form-container"]}>
      <form onSubmit={onSubmit} className={styles["form-body"]} style={{marginTop}}>
        {children}
        {genericError && (
          <span className={styles["server-error-message"]}>
            Server Error. Please Refresh Page or try again later.
          </span>
        )}
      </form>
    </main>
  );
};