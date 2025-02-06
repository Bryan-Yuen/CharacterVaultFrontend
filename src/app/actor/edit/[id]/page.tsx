"use client";

import React from "react";
import NonDashboardNavbar from "@/components/navBars/nonDashboardNavBar/NonDashboardNavbar";
import EditActorBody from "@/components/editActorPage/EditActorBody";
import { ApolloProvider } from "@apollo/client";
import client from "@/apolloClient/apolloClient";
import AuthenticationWrapper from "@/components/utilities/AuthenticationWrapper";

export default function Actor() {
  return (
    <ApolloProvider client={client}>
        <AuthenticationWrapper>
          <NonDashboardNavbar />
          <EditActorBody />
        </AuthenticationWrapper>
    </ApolloProvider>
  );
}
