import React from "react";
import styles from "./PornstarLimitUpgradeModal.module.scss";
import { useMutation, useQuery } from "@apollo/client";
import { GET_USER_PROFILE } from "@/queries/userQueries";
import { UPDATE_USER_IS_INTERESTED } from "@/mutations/userMutations";
import Loading from "@/components/utilities/Loading";
import ErrorMessage from "@/components/utilities/ErrorMessage";
import { useEffect, useState } from "react";
import GenericError from "../../utilities/GenericError";
import MutationVersionError from "../../utilities/MutationVersionError";
import RateLimitError from "../../utilities/RateLimitError";
import { useApolloClient } from "@apollo/client";

interface propDefs {
  setPornstarLimitUpgradeModalIsOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}

export default function PornstarLimitUpgradeModal(props: propDefs) {
  const client = useApolloClient();

  const { loading, error, data } = useQuery(GET_USER_PROFILE , {
    onCompleted: (data) => {
      setUserIsInterested(data.getUserProfile.user_is_interested);
    }
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
      }
     else if (result.data) {
      client.writeQuery({
        query: GET_USER_PROFILE,
        data: {
          getUserProfile: {
            __typename: 'UserProfileReturn', // Ensure this matches your schema typename
            user_is_interested: isChecked,  // Update the `user_is_interested` field
            user_email: data.getUserProfile.user_email,
            user_username: data.getUserProfile.user_username
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
    <div
      className={styles["backdrop"]}
      onClick={() => props.setPornstarLimitUpgradeModalIsOpen(false)}
    >
      <div className={styles["modal"]} onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => props.setPornstarLimitUpgradeModalIsOpen(false)}
          className={styles["close"]}
        >
          &#10006;
        </button>
        <div className={styles["modal-title"]}>Pornstar Limit Reached</div>
        <div className={styles["modal-content"]}>
          <span>
            Thank you for using MyFapSheet. We are currently in the beta phase
            of our service so we will only be allowing a maximum of 25
            pornstars. The premium plan that will allow up to 1000 pornstars and
            will be $3.99/month will be coming soon.
          </span>
          <div className={styles["checkbox-message-container"]}>
            <input
              type="checkbox"
              className={styles["checkbox"]}
              name="interested"
              checked={userIsInterested || false}
              onChange={updateUserInterestedHandler}
            />
            <label className={styles["checkbox-message"]} htmlFor="interested">
              Check here if you are interested in being notified by email when
              the premium plan releases.
            </label>
          </div>
        </div>
        <button
          onClick={() => props.setPornstarLimitUpgradeModalIsOpen(false)}
          className={styles["upgrade-link-button"]}
        >
          Close
        </button>
        <GenericError genericError={genericError} />
        <MutationVersionError versionError={versionError} />
        <RateLimitError rateLimitError={rateLimitError} />
      </div>
    </div>
  );
}
