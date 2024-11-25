"use client";

import React, { ReactNode ,useState} from 'react'
import { useApolloClient } from "@apollo/client";
import { ThreeDots } from "react-loader-spinner";
import { CHECK_USER_LOGGED_IN } from "@/queries/userQueries";
import { useRouter } from "next/navigation";
import { useQuery} from "@apollo/client";
import styles from './AuthenticationWrapper.module.scss';

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
    color="white"
    radius="9"
    ariaLabel="three-dots-loading"
    wrapperStyle={{}}
    wrapperClass={styles['authentication-wrapper-page-styles']}
  />
  // need to return an error page here or else it's just a line on the top left corner with error message
    if (error) return <div>Error! {error.message}</div>;
  return (
    <>{ success && children }</>
  )
}
