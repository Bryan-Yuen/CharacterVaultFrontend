"use client";

import React from "react";
import LoginBody from "@/components/loginpage/LoginBody";
import { ApolloProvider } from "@apollo/client";
import client from "@/apolloClient/apolloClient";
//import ApolloClientWrapper from "@/components/utilities/ApolloClientWrapper";
import HomePageAuthenticationWrapper from "@/components/utilities/HomePageAuthenticationWrapper";

export default function Login() {
  return (
    <ApolloProvider client={client}>
      <HomePageAuthenticationWrapper>
        <LoginBody />
      </HomePageAuthenticationWrapper>
    </ApolloProvider>
  );
}
