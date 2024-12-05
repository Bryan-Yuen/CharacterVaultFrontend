'use client'

import React from "react";
import EmailVerificationNavBar from "@/components/navBars/emailVerificationNavBar/EmailVerificationNavBar";
import EmailVerificationBody from "@/components/emailVerificationPage/EmailVerificationBody";
import { ApolloProvider } from "@apollo/client";
import client from "../../apolloClient/apolloClient";
import { Suspense } from 'react'
import HomePageAuthenticationWrapper from "@/components/utilities/HomePageAuthenticationWrapper";
//import AuthenticationWrapper from "@/components/utilities/AuthenticationWrapper";

// page when user clicks on link in email
export default function EmailVerification() {
  return (
    <ApolloProvider client={client}>
      <HomePageAuthenticationWrapper>
      <EmailVerificationNavBar />
      <Suspense>
      <EmailVerificationBody />
      </Suspense>
      </HomePageAuthenticationWrapper>
      </ApolloProvider>
  );
}
