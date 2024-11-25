import styles from "./SettingsBody.module.scss";
import Link from "next/link";
import { useQuery, useMutation } from "@apollo/client";
import { GET_USER_PROFILE } from "@/queries/userQueries";
import React, {useState} from "react";

export default function SettingsBody() {
  //const client = useApolloClient();
  const { loading, error, data } = useQuery(
    GET_USER_PROFILE
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error! {error.message}</div>;

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
              <span className={styles["setting-fields"]}>
                Password: ******
              </span>
            </div >
            <div className={styles["email-password-buttons-container"]}>
              {/*                 <button className={styles["change-email-button"]}>Change Email</button>           <button className={styles["change-password-button"]}>Change Password</button> */}
              <Link href={"/change-email"} className={styles["change-email-button"]}>
                Change Email
              </Link>
              <Link href={"/update-password"} className={styles["change-password-button"]}>
                Change Password
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
