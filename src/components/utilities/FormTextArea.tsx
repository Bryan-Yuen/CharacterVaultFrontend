import React, { ChangeEvent, FocusEvent, ReactNode } from "react";
import styles from "./FormTextArea.module.scss";

interface FormTextAreaProps {
  children: ReactNode
  inputIsInvalid: boolean;
  label: string;
  placeholder: string;
  onChangeHandler: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onBlurHandler: (e: FocusEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  value?: string;
}

export default function FormTextArea({
  children,
  inputIsInvalid,
  label,
  placeholder,
  onChangeHandler,
  onBlurHandler,
  rows = 4,
  value
}: FormTextAreaProps) {
  return (
    <div
    className={`${styles["textarea-container"]} ${styles[inputIsInvalid ? "invalid" : ""]}`}
  >
    <label>{label}</label>
    <textarea
      placeholder={placeholder}
      onChange={onChangeHandler}
      onBlur={onBlurHandler}
      rows={rows}
      {...(value !== undefined ? { value } : {})}
    />
    {children}
  </div>
  );
}
