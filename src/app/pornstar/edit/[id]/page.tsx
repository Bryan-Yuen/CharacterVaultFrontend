"use client";

import React from "react";
import NonDashboardNavbar from "@/components/navBars/nonDashboardNavBar/NonDashboardNavbar";
import EditPornstarBody from "@/components/editPornstarPage/EditPornstarBody";
import { ApolloProvider } from "@apollo/client";
import client from "@/apolloClient/apolloClient";
import AuthenticationWrapper from "@/components/utilities/AuthenticationWrapper";

export default function Pornstar() {
  return (
    <ApolloProvider client={client}>
        <AuthenticationWrapper>
          <NonDashboardNavbar />
          <EditPornstarBody />
        </AuthenticationWrapper>
    </ApolloProvider>
  );
}
