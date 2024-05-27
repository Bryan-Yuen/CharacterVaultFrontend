"use client";

import React from "react";
import NonDashboardNavbar from "@/components/navBars/nonDashboardNavBar/NonDashboardNavbar";
import AddPornstarBody from "@/components/addPornstarPage/AddPornstarBody";
import { ApolloProvider } from "@apollo/client";
import client from "@/apolloClient/apolloClient";
import AuthenticationWrapper from "@/components/utilities/AuthenticationWrapper";

export default function addPornstar() {
  return (
    <ApolloProvider client={client}>
      <AuthenticationWrapper>
        <NonDashboardNavbar />
        <AddPornstarBody />
      </AuthenticationWrapper>
    </ApolloProvider>
  );
}
