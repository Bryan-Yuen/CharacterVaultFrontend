import React, { FormEvent } from "react";
import styles from "./AccountDropdown.module.scss";
import { LOGOUT_USER } from "@/mutations/userMutations";
import { useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useApolloClient } from "@apollo/client";
import Link from "next/link";
import { GET_USER_PROFILE } from "@/queries/userQueries";
import OutsideClickDetector from "@/components/utilities/OutsideClickDetector";
import { ThreeDots } from "react-loader-spinner";
import { RotatingLines } from "react-loader-spinner";

interface propDefs {
  setDropdownIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AccountDropdown(props: propDefs) {
  const [logoutUser, { loading: logoutLoading }] = useMutation(LOGOUT_USER, {
    errorPolicy: "all",
  });

  const { loading, error, data } = useQuery(GET_USER_PROFILE);

  const router = useRouter();
  const client = useApolloClient();

  const logoutUserHandler = async () => {
    //e.preventDefault();

    try {
      const result = await logoutUser();
      if (!result) {
        return;
      }

      if (result.errors && result.errors.length > 0) {
        console.log("there was errors");
        console.log(result);
        console.log(result.errors[0].extensions.code);
        return;
        // obviously put these code in a constant maybe in a file somewhere
      } else if (result.data) {
        console.log(result.data);
        console.log("it worked");
        //router.push("/dashboard")
        console.log(result.data);
        // clear cache after log out
        client.clearStore();
        //redirect
        router.push("/"); // Redirect to "/dashboard"
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
  if (error) return <div>Error! {error.message}</div>;

  return (
    <OutsideClickDetector onOutsideClick={() => props.setDropdownIsOpen(false)}>
      <div className={styles["modal"]} onClick={(e) => e.stopPropagation()}>
        <span className={styles["username"]}>
          {data.getUserProfile.user_username}
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
      </div>
    </OutsideClickDetector>
  );
}
