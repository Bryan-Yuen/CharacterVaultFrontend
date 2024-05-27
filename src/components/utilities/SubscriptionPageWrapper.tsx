"use client";

import React, { ReactNode ,useState} from 'react'
import { ThreeDots } from "react-loader-spinner";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client";
import { CHECK_SUBSCRIPTION } from "@/queries/subscription";

interface WrapperProps {
  children: ReactNode;
}

enum Subscription_Status {
  ACTIVE_SUBSCRIPTION = "ACTIVE_SUBSCRIPTION",
  NO_SUBSCRIPTION = "NO_SUBSCRIPTION",
  CANCELLING_SUBSCRIPTION = "CANCELLING_SUBSCRIPTION",
}

export default function SubscriptionPageWrapper({ children } : WrapperProps) {
  const router = useRouter();
  const [success, setSuccess] = useState<boolean>(false);
  const { loading, error, data } = useQuery(
    CHECK_SUBSCRIPTION, {
      onCompleted: (data) => {
        if(data.checkSubscription.subscription_status ===
          Subscription_Status.ACTIVE_SUBSCRIPTION ||
          data.checkSubscription.subscription_status ===
            Subscription_Status.CANCELLING_SUBSCRIPTION)
          {
            router.push("/dashboard");
          }
          else
          setSuccess(true)
      },
    });


    if (loading) return  <ThreeDots
    visible={true}
    height="80"
    width="80"
    color="rgb(22, 122, 207);"
    radius="9"
    ariaLabel="three-dots-loading"
    wrapperStyle={{}}
    wrapperClass=""
  />
    if (error) return <div>Error! {error.message}</div>;
  return (
    <>{ success && children }</>
  )
}
