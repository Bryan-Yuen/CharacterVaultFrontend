"use client";

import React, { ReactNode,useState } from 'react'
import { useQuery, useMutation } from "@apollo/client";
import { CHECK_USER_LOGGED_IN } from "@/queries/userQueries";
import { useRouter } from "next/navigation";
import { ThreeDots } from 'react-loader-spinner'

interface WrapperProps {
  children: ReactNode;
}

export default function HomePageAuthenticationWrapper({ children } : WrapperProps) {
  const router = useRouter();
  const [success, setSuccess] = useState<boolean>(false);
  const { loading, error, data } = useQuery(
    CHECK_USER_LOGGED_IN, {
      onCompleted: (data) => {
        if(data.checkIfLoggedin)
          {
            router.push("/dashboard");
          }
          else
          setSuccess(true)
      },
    });

    //consider not loading anything for loading
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
