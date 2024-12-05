import React, { useState } from "react";
import styles from "./AccountDropdown.module.scss";
import { LOGOUT_USER } from "@/mutations/userMutations";
import { useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useApolloClient } from "@apollo/client";
import Link from "next/link";
import { GET_USER_PROFILE } from "@/queries/userQueries";
import OutsideClickDetector from "@/components/utilities/OutsideClickDetector";
import { RotatingLines } from "react-loader-spinner";
import GenericError from "../../utilities/GenericError";
import MutationVersionError from "../../utilities/MutationVersionError";
import RateLimitError from "../../utilities/RateLimitError";

interface propDefs {
  setDropdownIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AccountDropdown(props: propDefs) {
  const [logoutUser, { loading: logoutLoading }] = useMutation(LOGOUT_USER);

  const { loading, error, data } = useQuery(GET_USER_PROFILE);
  const [genericError, setGenericError] = useState(false);
  const [versionError, setVersionError] = useState(false);
  const [rateLimitError, setRateLimitError] = useState(false);

  const router = useRouter();
  const client = useApolloClient();

  const logoutUserHandler = async () => {
    //e.preventDefault();

    try {
      const result = await logoutUser();
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
        // clear cache after log out
        client.clearStore();
        // redirect to homepage
        router.push("/");
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    }
  };

  if (loading)
    return (
      <OutsideClickDetector
        onOutsideClick={() => props.setDropdownIsOpen(false)}
      >
        <div className={styles["modal"]} onClick={(e) => e.stopPropagation()}>
          <div className={styles["account-dropdown-loading"]}>
            <RotatingLines
              visible={true}
              width="25"
              strokeWidth="5"
              strokeColor="white"
              animationDuration="0.75"
              ariaLabel="rotating-lines-loading"
            />
          </div>
        </div>
      </OutsideClickDetector>
    );
  // error handler is below

  return (
    <OutsideClickDetector onOutsideClick={() => props.setDropdownIsOpen(false)}>
      <div className={styles["modal"]} onClick={(e) => e.stopPropagation()}>
        <span className={styles["username"]}>
          {error ? (
            <div>Error fetching profile.</div>
          ) : (
            data.getUserProfile.user_username
          )}
        </span>
        <Link className={styles["setting-list-item"]} href={"/settings"}>
          Account
        </Link>
        <Link className={styles["setting-list-item"]} href={"/resources"}>
          Resources
        </Link>
        <Link className={styles["setting-list-item"]} href={"/support"}>
          Support
        </Link>
        <button
          className={`${styles["setting-list-item"]} ${styles["log-out-button"]}`}
          onClick={logoutUserHandler}
        >
          {logoutLoading ? (
            <RotatingLines
              visible={true}
              width="25"
              strokeWidth="5"
              strokeColor="white"
              animationDuration="0.75"
              ariaLabel="rotating-lines-loading"
            />
          ) : (
            "Log Out"
          )}
        </button>
        <GenericError genericError={genericError} />
        <MutationVersionError versionError={versionError} />
        <RateLimitError rateLimitError={rateLimitError} />
      </div>
    </OutsideClickDetector>
  );
}
