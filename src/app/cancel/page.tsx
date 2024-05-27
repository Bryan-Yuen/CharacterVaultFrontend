"use client";

import React from "react";
import NonDashboardNavbar from "@/components/navBars/nonDashboardNavBar/NonDashboardNavbar";
import CancelBody from "@/components/cancelPage/CancelBody";
import { ApolloProvider } from "@apollo/client";
import client from "../../apolloClient/apolloClient";
import AuthenticationWrapper from "@/components/utilities/AuthenticationWrapper";

export default function cancel() {
  return (
    <ApolloProvider client={client}>
      <AuthenticationWrapper>
        <NonDashboardNavbar />
        <CancelBody />
      </AuthenticationWrapper>
    </ApolloProvider>
  );
}
