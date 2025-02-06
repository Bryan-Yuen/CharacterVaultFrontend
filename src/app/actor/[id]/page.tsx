"use client";

import React from "react";
import NonDashboardNavbar from "@/components/navBars/nonDashboardNavBar/NonDashboardNavbar";
import ViewActorBody from "@/components/viewActorPage/ViewActorBody";
import { ApolloProvider } from "@apollo/client";
import client from "@/apolloClient/apolloClient";
import AuthenticationWrapper from "@/components/utilities/AuthenticationWrapper";

export default function Actor() {
  return (
    <ApolloProvider client={client}>
        <AuthenticationWrapper>
          <NonDashboardNavbar />
          <ViewActorBody />
        </AuthenticationWrapper>
    </ApolloProvider>
  );
}
