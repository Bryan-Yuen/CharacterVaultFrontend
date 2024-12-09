import React, { useState } from "react";
import styles from "./EmailVerificationNavBar.module.scss";
import Link from "next/link";
import Image from "next/image";
import { LOGOUT_USER } from "@/mutations/userMutations";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useApolloClient } from "@apollo/client";
import { RotatingLines } from "react-loader-spinner";
import GenericError from "../../utilities/GenericError";
import MutationVersionError from "../../utilities/MutationVersionError";
import RateLimitError from "../../utilities/RateLimitError";

export default function EmailVerificationNavBar() {
  const [logoutUser, { loading: logoutLoading }] = useMutation(LOGOUT_USER, {
    errorPolicy: "all"
  });

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
            setRateLimitError(true)
            break;
          default:
            setGenericError(true);
        }
      } else if (result.data) {
        // clear cache after log out
        client.clearStore();
        //redirect
        router.push("/"); // Redirect to "/dashboard"
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    }
  };

  return (
    <nav className={styles["navbar"]}>
      <div className={styles["navbar-container"]}>
        <Link
          href={"/"}
          className={`${styles["header"]} ${styles["website-name-and-icon-container"]}`}
        >
          {" "}
          <Image
            priority
            src="/MyFapSheetSVG.svg"
            alt="Down Icon"
            height={0}
            width={32}
            className={styles["website-icon"]}
          />
          <div className={styles["website-name"]}>MyFapSheet</div>
        </Link>
        <div>
          <button
            className={styles["log-out-button"]}
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
      </div>
    </nav>
  );
}
