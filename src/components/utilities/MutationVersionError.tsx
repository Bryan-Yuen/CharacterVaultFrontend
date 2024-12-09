import React from "react";
import styles from "./MutationVersionError.module.scss";

interface VersionErrorProps {
  versionError: boolean;
}

export default function MutationVersionError({ versionError }: VersionErrorProps) {
  return (
    <>
      {versionError && (
        <span className={styles["version-error-message"]}>
          Version Error. A new web version is available. Please save your data and refresh the page and try again.
        </span>
      )}
    </>
  );
}
