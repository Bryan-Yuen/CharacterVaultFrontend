import styles from "./ConfirmNewEmailBody.module.scss";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CONFIRM_CHANGE_EMAIL } from "@/mutations/userMutations";
import { useMutation } from "@apollo/client";
import { ThreeDots } from "react-loader-spinner";

export default function ConfirmNewEmailBody() {
  const params = useSearchParams();
  const token = params.get("token");

  const [showErrorMessage, setShowErrorMessage] = useState<Boolean>(false);
  const [gotResponse, setgotResponse] = useState<Boolean>(false);
  const [genericError, setGenericError] = useState(false);

  useEffect(() => {
    if (token) confirmChangeEmailHandler();
  }, [token]);

  const [confirmChangeEmail] = useMutation(CONFIRM_CHANGE_EMAIL, {
    variables: {
      token: token,
    },
    errorPolicy: "all",
  });

  const confirmChangeEmailHandler = async () => {
    try {
      const result = await confirmChangeEmail();
      if (!result) {
        setGenericError(true);
        return;
      }
      if (result.errors && result.errors.length > 0) {
        setShowErrorMessage(true);
        setgotResponse(true);
      } else setgotResponse(true);
      // do nothing if we get data back, which means success
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      setGenericError(true);
    }
  };

  return (
    <>
      {gotResponse ? (
        <main className={styles["confirm-new-email-body-container"]}>
          <div className={styles["content-container"]}>
            {showErrorMessage || !token ? (
              <>
                <h1 className={styles["header"]}>
                  Sorry, the confirm new email link has expired.
                </h1>
                <span className={styles["call-to-action-message"]}>
                  Please send another request to change the email.
                </span>
              </>
            ) : (
              <>
                <h1 className={styles["header"]}>
                  Your email address has been successfully updated!
                </h1>
                <span className={styles["call-to-action-message"]}>
                  Please log in next time with your new email.
                </span>
              </>
            )}
            {genericError && (
              <span className={styles["server-error-message"]}>
                Server Error. Please Refresh Page or try again later.
              </span>
            )}
          </div>
        </main>
      ) : (
        <ThreeDots
          visible={true}
          height="80"
          width="80"
          color="white"
          radius="9"
          ariaLabel="three-dots-loading"
          wrapperStyle={{}}
          wrapperClass={styles["loading-spinner"]}
        />
      )}
    </>
  );
}
