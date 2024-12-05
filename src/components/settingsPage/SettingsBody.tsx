import styles from "./SettingsBody.module.scss";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { GET_USER_PROFILE } from "@/queries/userQueries";
import Loading from "@/components/utilities/Loading";
import Error from "@/components/utilities/Error";

export default function SettingsBody() {
  const { loading, error, data } = useQuery(GET_USER_PROFILE);

  if (loading) return <Loading />;
  if (error) {
    if (error.graphQLErrors && error.graphQLErrors.length > 0) {
      const errorCode = error.graphQLErrors[0].extensions.code;

      switch (errorCode) {
        case "VERSION_ERROR":
          return (
            <Error>
              Version Error. A new web version is available. Please refresh your
              page.
            </Error>
          );
        case "RATE_LIMIT_ERROR":
          return (
            <Error>
              Too many requests for this resource. Please wait and try again
              again later. Contact support if you think this is was an error.
            </Error>
          );
        default:
          return (
            <Error>
              Error loading tags. Please refresh the page and try again.
              <br></br>
              If error persists please contact support@myfapsheet.com for help
            </Error>
          );
      }
    }
    return (
      <Error>
        Error loading tags. Please refresh the page and try again.
        <br></br>
        If error persists please contact support@myfapsheet.com for help
      </Error>
    );
  }

  return (
    <div className={styles["container"]}>
      <div className={styles["content-container"]}>
        <h1 className={styles["header"]}>Account</h1>
        <div className={styles["profile-container"]}>
          <h2 className={styles["sub-headers"]}>Profile</h2>
          <span className={styles["setting-fields"]}>
            Username: {data.getUserProfile.user_username}
          </span>
          <div className={styles["email-password-and-buttons-container"]}>
            <div className={styles["email-password-container"]}>
              <span className={styles["setting-fields"]}>
                Email: {data.getUserProfile.user_email}
              </span>
              <span className={styles["setting-fields"]}>Password: ******</span>
            </div>
            <div className={styles["email-password-buttons-container"]}>
              {/*                 <button className={styles["change-email-button"]}>Change Email</button>           <button className={styles["change-password-button"]}>Change Password</button> */}
              <Link
                href={"/change-email"}
                className={styles["change-email-button"]}
              >
                Change Email
              </Link>
              <Link
                href={"/update-password"}
                className={styles["change-password-button"]}
              >
                Change Password
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
