import styles from "./ConfirmNewEmailBody.module.scss";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CONFIRM_CHANGE_EMAIL } from "@/mutations/userMutations";
import { useMutation } from "@apollo/client";
import Loading from "../utilities/Loading";
import { useRef } from "react";
import GenericError from "../utilities/GenericError";
import QueryVersionError from "../utilities/QueryVersionError";
import RateLimitError from "../utilities/RateLimitError";

export default function ConfirmNewEmailBody() {
  const params = useSearchParams();
  const token = params.get("token");
  const hasRun = useRef(false);

  const [tokenExpired, setTokenExpired] = useState(false);
  const [genericError, setGenericError] = useState(false);
  const [versionError, setVersionError] = useState(false);
  const [rateLimitError, setRateLimitError] = useState(false);

  // run 1 time only
  useEffect(() => {
    if (!hasRun.current && token) {
      confirmChangeEmailHandler();
      hasRun.current = true;
    }
  }, [token]);

  const [confirmChangeEmail, { data, loading }] = useMutation(
    CONFIRM_CHANGE_EMAIL,
    {
      variables: {
        confirmChangeEmailInput: {
          token: token,
        },
      },
      errorPolicy: "all"
    }
  );

  const confirmChangeEmailHandler = async () => {
    try {
      const result = await confirmChangeEmail();
      if (!result) {
        setGenericError(true);
        return;
      }
      if (result.errors && result.errors.length > 0) {
        const errorCode = result.errors[0].extensions?.code;

        switch (errorCode) {
          case "TOKEN_EXPIRED":
            setTokenExpired(true);
            break;
          case "VERSION_ERROR":
            setVersionError(true);
            break;
          case "RATE_LIMIT_ERROR":
            setRateLimitError(true);
            break;
          default:
            setGenericError(true);
        }
      }
      // do nothing if we get data back, which means success
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      setGenericError(true);
    }
  };

  if (loading) return <Loading />;

  return (
    <main className={styles["confirm-new-email-body-container"]}>
      <div className={styles["content-container"]}>
        {(tokenExpired || !token) && (
          <>
            <h1 className={styles["header"]}>
              Sorry, the confirm new email link has expired.
            </h1>
            <span className={styles["call-to-action-message"]}>
              Please send another request to change the email.
            </span>
          </>
        )}{" "}
        {data && (
          <>
            <h1 className={styles["header"]}>
              Your email address has been successfully updated!
            </h1>
            <span className={styles["call-to-action-message"]}>
              Please log in next time with your new email.
            </span>
          </>
        )}
        <GenericError genericError={genericError} />
        <QueryVersionError versionError={versionError} />
        <RateLimitError rateLimitError={rateLimitError} />
      </div>
    </main>
  );
}
