import styles from "./SettingsBody.module.scss";
import Link from "next/link";
import { useQuery, useMutation } from "@apollo/client";
import { GET_USER_PROFILE } from "@/queries/user";
//import { CHECK_USER_PREMIUM } from "@/queries/user";
import { CHECK_SUBSCRIPTION } from "@/queries/subscription";
import { KEEP_SUBSCRIPTION} from "@/mutations/paymentMutation";
import UpdatePaymentForm from "./UpdatePaymentForm.";
import React, {useState} from "react";

enum Subscription_Status {
  ACTIVE_SUBSCRIPTION = "ACTIVE_SUBSCRIPTION",
  NO_SUBSCRIPTION = "NO_SUBSCRIPTION",
  CANCELLING_SUBSCRIPTION = "CANCELLING_SUBSCRIPTION",
}

export default function SettingsBody() {
  //const client = useApolloClient();
  const { loading, error, data } = useQuery(
    GET_USER_PROFILE
  );

  const {
    loading: loading2,
    error: error2,
    data: data2,
  } = useQuery(
    CHECK_SUBSCRIPTION
  );

    const [showUpdatePaymentForm, setShowUpdatePaymentForm] = useState<boolean>(false)

    const [keepSubscription] = useMutation(KEEP_SUBSCRIPTION, {
      errorPolicy: "all",
    });

    const keepSubscriptionHandler = async (e : React.MouseEvent<HTMLElement>) => {
      e.preventDefault();

      const result = await keepSubscription();
      if (result.errors) {
        console.log("there was errors");
        console.log(result);
        console.log(result.errors[0].extensions.code);
        // obviously put these code in a constant maybe in a file somewhere
      } else if (result.data) {
        console.log("it worked");
        console.log(result);
        // maybe do a pop up notification too
        window.location.reload();
      }

    };


  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error! {error.message}</div>;
  if (loading2) return <div>Loading...</div>;
  if (error2) return <div>Error! {error2.message}</div>;
  console.log(
    data2.checkSubscription.subscription_status ===
      Subscription_Status.ACTIVE_SUBSCRIPTION ||
      data2.checkSubscription.subscription_status ===
        Subscription_Status.CANCELLING_SUBSCRIPTION
  );
  console.log("hi", data2.checkSubscription.user_last_four_credit_card_number);
  console.log("boob",data2)
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
        {(data2.checkSubscription.subscription_status ===
          Subscription_Status.ACTIVE_SUBSCRIPTION ||
          data2.checkSubscription.subscription_status ===
            Subscription_Status.CANCELLING_SUBSCRIPTION) && (
          <div className={styles["payment-method-container"]}>
            <h2 className={styles["sub-headers"]}>Payment Method</h2>
            <span className={styles["setting-fields"]}>
              Card Ending in {" "}
              {data2.checkSubscription.user_last_four_credit_card_number}{" "}
              <button className={styles["update-payment-button"]} onClick={() => setShowUpdatePaymentForm(true)}>Update</button>
            </span>
            {data2.checkSubscription.subscription_status ===
          Subscription_Status.ACTIVE_SUBSCRIPTION && <span>Your next billing date is {(new Date(data2.checkSubscription.subscription_next_billing_date)).toLocaleDateString('en-US',{ month: 'long', day: 'numeric', year: 'numeric' })}</span>}
            {showUpdatePaymentForm && <UpdatePaymentForm/>}
          </div>
        )}
        <div className={styles["plan-container"]}>
          <h2 className={styles["sub-headers"]}>Current Plan</h2>
          <div className={styles["plan-details-container"]}>
            <span className={styles["setting-fields"]}>
              {data2.checkSubscription.subscription_status ===
                Subscription_Status.ACTIVE_SUBSCRIPTION ||
              data2.checkSubscription.subscription_status ===
                Subscription_Status.CANCELLING_SUBSCRIPTION
                ? "Premium Sheet"
                : "Basic Sheet"}
            </span>
            <span className={styles["setting-fields"]}>
              {data2.checkSubscription.subscription_status ===
                Subscription_Status.ACTIVE_SUBSCRIPTION ||
              data2.checkSubscription.subscription_status ===
                Subscription_Status.CANCELLING_SUBSCRIPTION
                ? "$3.99/Month"
                : "Free"}
            </span>
            {data2.checkSubscription.subscription_status ===
              Subscription_Status.NO_SUBSCRIPTION && (
              <Link href={"/upgrade"} className={styles["upgrade-link"]}>
                Upgrade
              </Link>
            )}
            {data2.checkSubscription.subscription_status ===
              Subscription_Status.ACTIVE_SUBSCRIPTION && (
                <Link href={"/cancel"} className={styles["cancel-link"]}>
                Cancel Subscription
              </Link>
            )}
            {data2.checkSubscription.subscription_status ===
              Subscription_Status.CANCELLING_SUBSCRIPTION && (
              <>
                <span>Your subscription will end on {(new Date(data2.checkSubscription.subscription_end_date)).toLocaleDateString('en-US',{ month: 'long', day: 'numeric', year: 'numeric' })}</span>
                <button className={styles["keep-button"]} onClick={keepSubscriptionHandler}>Keep Subscription</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
