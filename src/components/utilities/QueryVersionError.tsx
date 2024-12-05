import React from "react";
import styles from "./QueryVersionError.module.scss";

interface VersionErrorProps {
  versionError: boolean;
}

export default function QueryVersionError({ versionError }: VersionErrorProps) {
  return (
    <>
      {versionError && (
        <span className={styles["version-error-message"]}>
          Version Error. A new web version is available. Please refresh your page.
        </span>
      )}
    </>
  );
}
