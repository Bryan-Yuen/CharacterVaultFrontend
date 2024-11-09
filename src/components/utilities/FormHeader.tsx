import React from "react";
import styles from "./FormHeader.module.scss";

interface FormHeaderProps {
  header: string;
}

export default function FormHeader({
  header,
}: FormHeaderProps) {
  return (
    <h1 className={styles["header"]}>{header}</h1>
  );
}
