"use client";

import React from "react";
import NonDashboardNavbar from "@/components/navBars/nonDashboardNavBar/NonDashboardNavbar";
import AddActorBody from "@/components/addActorPage/AddActorBody";
import { ApolloProvider } from "@apollo/client";
import client from "@/apolloClient/apolloClient";
import AuthenticationWrapper from "@/components/utilities/AuthenticationWrapper";

export default function AddActor() {
  return (
    <ApolloProvider client={client}>
        <AuthenticationWrapper>
          <NonDashboardNavbar />
          <AddActorBody />
        </AuthenticationWrapper>
    </ApolloProvider>
  );
}
