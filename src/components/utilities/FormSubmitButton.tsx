import React from "react";
import styles from "./FormSubmitButton.module.scss";
import { RotatingLines } from "react-loader-spinner";

interface FormSubmitButtonProps {
  formIsInvalid: boolean;
  loading: boolean;
  buttonText: string;
  deleteButton? : boolean;
}

export default function FormSubmitButton({
  formIsInvalid,
  loading,
  buttonText,
  deleteButton = false
} : FormSubmitButtonProps) {
  return (
    <div className={styles["submit-button-container"]}>
      <button
        disabled={formIsInvalid || loading}
        className={`${styles["submit-button"]} ${styles[deleteButton ? "delete-button" : ""]}`}
      >
        {loading ? (
          <RotatingLines
            visible={true}
            width="25"
            strokeWidth="5"
            strokeColor="white"
            animationDuration="0.75"
            ariaLabel="rotating-lines-loading"
          />
        ) : (
          buttonText
        )}
      </button>
    </div>
  );
}
