'use client'

import React from "react";
import HomePageNavBar from "@/components/navBars/homePageNavBar/HomePageNavBar";
import EmailVerifiedBody from "@/components/emailVerifiedPage/EmailVerifiedBody";
import { ApolloProvider } from "@apollo/client";
import client from "../../apolloClient/apolloClient";
import { Suspense } from 'react'
//import AuthenticationWrapper from "@/components/utilities/AuthenticationWrapper";

// page when user clicks on link in email
export default function EmailVerified() {
  return (
    <ApolloProvider client={client}>
      <HomePageNavBar />
      <Suspense>
      <EmailVerifiedBody />
      </Suspense>
      </ApolloProvider>
  );
}
