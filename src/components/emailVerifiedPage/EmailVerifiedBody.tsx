import styles from "./EmailVerifiedBody.module.scss";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CONFIRM_EMAIL_ADDRESS } from "@/mutations/userMutations";
import { useMutation } from "@apollo/client";
import Link from "next/link";
import { useRef } from "react";
import Loading from "../utilities/Loading";
import GenericError from "../utilities/GenericError";
import QueryVersionError from "../utilities/QueryVersionError";
import RateLimitError from "../utilities/RateLimitError";

export default function EmailVerifiedBody() {
  const params = useSearchParams();
  const token = params.get("token");
  const hasRun = useRef(false);

  const [tokenExpired, setTokenExpired] = useState(false);
  const [genericError, setGenericError] = useState(false);
  const [versionError, setVersionError] = useState(false);
  const [rateLimitError, setRateLimitError] = useState(false);

  useEffect(() => {
    if (!hasRun.current && token) {
      confirmEmailHandler();
      hasRun.current = true;
    }
  }, [token]);

  const [confirmEmail, { data, loading }] = useMutation(CONFIRM_EMAIL_ADDRESS, {
    variables: {
      confirmEmailAddressInput: {
        token: token,
      },
    },
    errorPolicy: "all"
  });

  const confirmEmailHandler = async () => {
    try {
      const result = await confirmEmail();
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
    <>
      <main className={styles["confirm-new-email-body-container"]}>
        <div className={styles["content-container"]}>
          {(tokenExpired || !token) && (
            <>
              <h1 className={styles["header"]}>
                Sorry, the email verification link has expired.
              </h1>
              <span className={styles["call-to-action-message"]}>
                Please log back in to send another request to verify email.
              </span>
            </>
          )}
          {data && (
            <>
              <h1 className={styles["header"]}>
                Your email address has been successfully verified
              </h1>
              <span className={styles["call-to-action-message"]}>
                Click here to login{" "}
                <Link href={"/login"} className={styles["login-button"]}>
                  Login
                </Link>
              </span>
            </>
          )}
          <GenericError genericError={genericError} />
          <QueryVersionError versionError={versionError} />
          <RateLimitError rateLimitError={rateLimitError} />
        </div>
      </main>
    </>
  );
}
