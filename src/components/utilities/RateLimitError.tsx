import React from "react";
import styles from "./RateLimitError.module.scss";

interface RateLimitErrorProps {
  rateLimitError: boolean;
}

export default function RateLimitError({ rateLimitError }: RateLimitErrorProps) {
  return (
    <>
      {rateLimitError && (
        <span className={styles["rate-limit-error-message"]}>
          Too many requests for this action. Please wait and try again again later. Contact support if you think this is was an error.
        </span>
      )}
    </>
  );
}
