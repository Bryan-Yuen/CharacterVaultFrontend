import styles from "./EmailVerificationBody.module.scss";
import { RESEND_VERIFICATION_EMAIL } from "@/mutations/userMutations";
import { GET_USER_PROFILE } from "@/queries/userQueries";
import React, {useState} from "react";
import { useMutation, useQuery } from "@apollo/client";
import SuccessMessage from "../utilities/SuccessMessage";
import { RotatingLines } from "react-loader-spinner";
import Loading from "../utilities/Loading";
import FormInputInvalidMessage from "../utilities/FormInputInvalidMessage";
import GenericError from "../utilities/GenericError";
import MutationVersionError from "../utilities/MutationVersionError";

export default function EmailVerificationBody() {
  const [resendVerificationEmail, { loading : resendVerificationEmailLoading }] = useMutation(RESEND_VERIFICATION_EMAIL, {
    errorPolicy: "all"
  });
  const { loading, error, data } = useQuery(GET_USER_PROFILE);
  
  const [genericError, setGenericError] = useState(false);
  const [versionError, setVersionError] = useState(false);
  const [rateLimitError, setRateLimitError] = useState(false);

  const [resendVerifcationEmailSent, setResendVerifcationEmailSent] = useState(false);

  const resendVerificationEmailHandler = async () => {
    //e.preventDefault();

    try {
      const result = await resendVerificationEmail();
      if (!result) {
        return;
      }

      if (result.errors && result.errors.length > 0) {
        setResendVerifcationEmailSent(false)
        const errorCode = result.errors[0].extensions?.code;

        switch (errorCode) {
          case "VERSION_ERROR":
            setVersionError(true);
            break;
          case "RATE_LIMIT_ERROR":
            setRateLimitError(true)
            break;
          default:
            setGenericError(true);
        }
      } else if (result.data) {
        console.log(result.data);
        setGenericError(false)
        setRateLimitError(false)
        setResendVerifcationEmailSent(true);
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    }
  };

  if (loading) return <Loading />;
  if (error) console.log(error)
  return (
    <main className={styles["email-verification-body-container"]}>
      <div className={styles["content-container"]}>
        <h1 className={styles["header"]}>Please verify your email</h1>
        <span className={styles["span1"]}>
          You're almost there! we sent an email to
        </span>
        <span className={styles["email"]}>
        {error ? <div>Error fetching email. Please Log back in to properly see this page and resend the email.</div> : data.getUserProfile.user_email}
        </span>
       <span className={styles["span2"]}>
        Just click on the link in that email to complete your signup. If you don't<br></br>see it, you may need to check your junk folder.
       </span>
       <span className={styles["span3"]}>
        Can't find the email?
       </span>
       <span className={styles["span4"]}>
       If you still don't see the email after 10 minutes<br></br> please email support@charactervault.site
       </span>
       <button className={styles["resend-button"]}
          onClick={resendVerificationEmailHandler} disabled={resendVerificationEmailLoading}>
        {resendVerificationEmailLoading ? (
          <RotatingLines
            visible={true}
            width="25"
            strokeWidth="5"
            strokeColor="white"
            animationDuration="0.75"
            ariaLabel="rotating-lines-loading"
          />
        ) : (
          "Resend verification email"
        )}
       </button>
       <SuccessMessage
        showSuccessMessage={resendVerifcationEmailSent}
      >Email successfully sent. Please wait 5 minutes<br></br> before requesting another email.</SuccessMessage>
              <FormInputInvalidMessage
          inputIsInvalid={rateLimitError}
          message="Please wait at least 5 minutes from last request before requesting a new email"
        />
                <GenericError genericError={genericError} />
          <MutationVersionError versionError={versionError} />
      </div>
    </main>
  );
}
