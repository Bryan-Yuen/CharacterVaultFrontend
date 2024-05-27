import styles from "./ConfirmNewEmailBody.module.scss";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CONFIRM_CHANGE_EMAIL } from "@/mutations/userMutations";
import { useMutation } from "@apollo/client";

export default function ConfirmNewEmailBody() {

  const params = useSearchParams();
  const token = params.get("token")
  console.log("token", token);
  const [showErrorMessage, setShowErrorMessage] = useState<Boolean>(false);

  const [confirmChangeEmail] = useMutation(CONFIRM_CHANGE_EMAIL, {
    variables: {
      token: token,
    },
    errorPolicy: "all",
  });

  const confirmChangeEmailHandler = async () => {
    console.log("gay");
    const result = await confirmChangeEmail();
    if (result.errors) {
      console.log("there was errors");
      console.log(result);
      setShowErrorMessage(true)
      console.log(result.errors[0].extensions.code);
      // obviously put these code in a constant maybe in a file somewhere
    } else if (result.data) {
      console.log("it worked");
      //router.push("/dashboard")
    }
  };

  // LETS DO AN ERROR IF THE TOKEN IS NOT THERE SAYING LINK EXPIRED
  useEffect(() => {
    if (token) confirmChangeEmailHandler(); // Trigger the mutation on component mount
  }, [token]); // Empty dependency array ensures the effect runs only once on mount

  // maybe lets return the spinner until the function finishes or else it's going to change text for like .5 seconds.
  return (
    <div className={styles["container"]}>
      <div className={styles["content-container"]}>
        {showErrorMessage || !token ? (
          <>
            <h2 className={styles["thank-you-message"]}>
              Confirm New Email Link has Expired.
            </h2>
            <span className={styles["call-to-action-message"]}>
              Please send another request to change the email.
            </span>
          </>
        ) : (
          <>
            <h2 className={styles["thank-you-message"]}>
              Your email address has been updated!
            </h2>
            <span className={styles["call-to-action-message"]}>
              Please log in next time with your new email.
            </span>
          </>
        )}
      </div>
    </div>
  );
}
