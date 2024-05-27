'use client'

import React from "react";
import HomePageNavBar from "@/components/navBars/homePageNavBar/HomePageNavBar";
import ConfirmNewEmailBody from "@/components/confirmNewEmailPage/ConfirmNewEmailBody";
import { ApolloProvider } from "@apollo/client";
import client from "../../apolloClient/apolloClient";
import { Suspense } from 'react'

// page when user clicks on link in email
export default function ConfirmNewEmail() {
  return (
    <ApolloProvider client={client}>
      <HomePageNavBar />
      <Suspense>
      <ConfirmNewEmailBody />
      </Suspense>
      </ApolloProvider>
  );
}
