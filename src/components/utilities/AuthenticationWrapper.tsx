"use client";

import React, { ReactNode ,useState} from 'react'
import { useApolloClient } from "@apollo/client";
import { ThreeDots } from "react-loader-spinner";
import { CHECK_USER_LOGGED_IN } from "@/queries/user";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client";

interface WrapperProps {
  children: ReactNode;
}

export default function AuthenticationWrapper({ children } : WrapperProps) {
  const router = useRouter();
  const client = useApolloClient();
  const [success, setSuccess] = useState<boolean>(false);
  const { loading, error, data } = useQuery(
    CHECK_USER_LOGGED_IN, {
      onCompleted: (data) => {
        if(!data.checkIfLoggedin)
          {
            client.clearStore()
            router.push("/");
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
