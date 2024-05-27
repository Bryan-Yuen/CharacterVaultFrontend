'use client'

import React from "react";
import HomePageNavBar from "@/components/navBars/homePageNavBar/HomePageNavBar";
import ForgotPasswordBody from "@/components/forgotPasswordPage/ForgotPasswordBody";
import { ApolloProvider } from "@apollo/client";
import client from "../../apolloClient/apolloClient";

export default function forgotPassword() {
  return (
    <ApolloProvider client={client}>
      <HomePageNavBar />
      <ForgotPasswordBody />
      </ApolloProvider>
  );
}
