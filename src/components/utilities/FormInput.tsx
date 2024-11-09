import React, { ChangeEvent, FocusEvent, ReactNode } from "react";
import styles from "./FormInput.module.scss";

interface FormInputProps {
  children: ReactNode
  inputIsInvalid: boolean;
  label: string;
  placeholder: string;
  onChangeHandler: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlurHandler: (e: FocusEvent<HTMLInputElement>) => void;
  type?: string;
  value?: string;
}

export default function FormInput({
  children,
  inputIsInvalid,
  label,
  placeholder,
  onChangeHandler,
  onBlurHandler,
  type = "text",
  value
}: FormInputProps) {
  return (
    <div
    className={`${styles["input-container"]} ${styles[inputIsInvalid ? "invalid" : ""]}`}
  >
    <label>{label}</label>
    <input
      placeholder={placeholder}
      onChange={onChangeHandler}
      onBlur={onBlurHandler}
      type={type}
      {...(value !== undefined ? { value } : {})}
    />
    {children}
  </div>
  );
}
