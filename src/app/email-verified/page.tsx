'use client'

import React from "react";
//import HomePageNavBar from "@/components/navBars/homePageNavBar/HomePageNavBar";
import EmailVerifiedNavBar from "@/components/navBars/emailVerifiedNavBar/EmailVerifiedNavBar";
import EmailVerifiedBody from "@/components/emailVerifiedPage/EmailVerifiedBody";
import { ApolloProvider } from "@apollo/client";
import client from "../../apolloClient/apolloClient";
import { Suspense } from 'react'
//import AuthenticationWrapper from "@/components/utilities/AuthenticationWrapper";

// page when user clicks on link in email
export default function EmailVerified() {
  return (
    <ApolloProvider client={client}>
      <EmailVerifiedNavBar />
      <Suspense>
      <EmailVerifiedBody />
      </Suspense>
      </ApolloProvider>
  );
}
