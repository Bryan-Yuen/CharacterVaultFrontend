'use client'

import React from "react";
import HomePageNavBar from "@/components/navBars/homePageNavBar/HomePageNavBar";
import ChangePasswordBody from "@/components/changePasswordPage/ChangePasswordBody";
import { ApolloProvider } from "@apollo/client";
import client from "../../apolloClient/apolloClient";
import { Suspense } from 'react'

// the public change password page after the password reset link
export default function ChangePassword() {
  return (
    <ApolloProvider client={client}>
      <HomePageNavBar />
      <Suspense>
      <ChangePasswordBody />
      </Suspense>
      </ApolloProvider>
  );
}
