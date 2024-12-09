"use client";

import React, { ReactNode, useState } from "react";
import { useApolloClient } from "@apollo/client";
import { CHECK_USER_LOGGED_IN } from "@/queries/userQueries";
import { useRouter } from "next/navigation";
import { useQuery } from "@apollo/client";
//import styles from './AuthenticationWrapper.module.scss';
import Loading from "@/components/utilities/Loading";
import Error from "@/components/utilities/Error";

interface WrapperProps {
  children: ReactNode;
}

export default function AuthenticationWrapper({ children }: WrapperProps) {
  const router = useRouter();
  const client = useApolloClient();
  const [success, setSuccess] = useState<boolean>(false);
  const { loading, error, data } = useQuery(CHECK_USER_LOGGED_IN, {
    onCompleted: (data) => {
      if (!data.checkIfLoggedin) {
        client.clearStore();
        router.push("/");
      } else setSuccess(true);
    },
  });

  if (loading) return <Loading />;
  if (error) {
    if (error.graphQLErrors && error.graphQLErrors.length > 0) {
      const errorCode = error.graphQLErrors[0].extensions.code;

      switch (errorCode) {
        case "VERSION_ERROR":
          return (
            <Error>
              Version Error. A new web version is available. Please refresh your
              page.
            </Error>
          );
        case "RATE_LIMIT_ERROR":
          return (
            <Error>
              Too many requests for this resource. Please wait and try again
              again later. Contact support if you think this is was an error.
            </Error>
          );
        default:
          return (
            <Error>
              Error loading user data. Please refresh the page and try again.
              <br></br>
              If error persists please contact support@myfapsheet.com for help
            </Error>
          );
      }
    }
    return (
      <Error>
        Error loading user data. Please refresh the page and try again.
        <br></br>
        If error persists please contact support@myfapsheet.com for help
      </Error>
    );
  }

  return <>{success && children}</>;
}
