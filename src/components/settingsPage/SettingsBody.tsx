import styles from "./SettingsBody.module.scss";
import Link from "next/link";
import { useMutation, useQuery } from "@apollo/client";
import { GET_USER_PROFILE } from "@/queries/userQueries";
import { UPDATE_USER_IS_INTERESTED } from "@/mutations/userMutations";
import Loading from "@/components/utilities/Loading";
import ErrorMessage from "@/components/utilities/ErrorMessage";
import { useEffect, useState } from "react";
import GenericError from "../utilities/GenericError";
import MutationVersionError from "../utilities/MutationVersionError";
import RateLimitError from "../utilities/RateLimitError";
import { useApolloClient } from "@apollo/client";

export default function SettingsBody() {
  const client = useApolloClient();

  const { loading, error, data } = useQuery(GET_USER_PROFILE, {
    onCompleted: (data) => {
      setUserIsInterested(data.getUserProfile.user_is_interested);
    },
  });

  const [userIsInterested, setUserIsInterested] = useState(true);
  const [genericError, setGenericError] = useState(false);
  const [versionError, setVersionError] = useState(false);
  const [rateLimitError, setRateLimitError] = useState(false);

  console.log(userIsInterested);

  const [updateUserIsInterested] = useMutation(UPDATE_USER_IS_INTERESTED, {
    errorPolicy: "all",
  });

  const updateUserInterestedHandler = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const isChecked = e.target.checked;
    setUserIsInterested(isChecked);

    try {
      const result = await updateUserIsInterested({
        variables: {
          updateUserIsInterestedInput: {
            user_is_interested: isChecked, // Use the current checkbox state
          },
        },
      });
      if (!result) {
        setGenericError(true);
        return;
      }
      if (result.errors && result.errors.length > 0) {
        const errorCode = result.errors[0].extensions?.code;

        switch (errorCode) {
          case "VERSION_ERROR":
            setVersionError(true);
            break;
          case "RATE_LIMIT_ERROR":
            setRateLimitError(true);
            break;
          default:
            setGenericError(true);
        }
      } else if (result.data) {
        client.writeQuery({
          query: GET_USER_PROFILE,
          data: {
            getUserProfile: {
              __typename: "UserProfileReturn", // Ensure this matches your schema typename
              user_is_interested: isChecked, // Update the `user_is_interested` field
              user_email: data.getUserProfile.user_email,
              user_username: data.getUserProfile.user_username,
            },
          },
        });
      }
      // do nothing if we get data back, which means success
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      setGenericError(true);
    }
  };

  if (loading) return <Loading />;
  if (error) {
    if (error.graphQLErrors && error.graphQLErrors.length > 0) {
      const errorCode = error.graphQLErrors[0].extensions.code;

      switch (errorCode) {
        case "VERSION_ERROR":
          return (
            <ErrorMessage>
              Version Error. A new web version is available. Please refresh your
              page.
            </ErrorMessage>
          );
        case "RATE_LIMIT_ERROR":
          return (
            <ErrorMessage>
              Too many requests for this resource. Please wait and try again
              again later. Contact support if you think this is was an error.
            </ErrorMessage>
          );
        default:
          return (
            <ErrorMessage>
              Error loading tags. Please refresh the page and try again.
              <br></br>
              If error persists please contact support@myfapsheet.com for help
            </ErrorMessage>
          );
      }
    }
    return (
      <ErrorMessage>
        Error loading tags. Please refresh the page and try again.
        <br></br>
        If error persists please contact support@myfapsheet.com for help
      </ErrorMessage>
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
        <GenericError genericError={genericError} />
        <MutationVersionError versionError={versionError} />
        <RateLimitError rateLimitError={rateLimitError} />
      </div>
    </div>
  );
}
