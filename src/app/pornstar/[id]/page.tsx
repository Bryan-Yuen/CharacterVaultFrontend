"use client";

import React from "react";
import NonDashboardNavbar from "@/components/navBars/nonDashboardNavBar/NonDashboardNavbar";
import ViewPornstarBody from "@/components/viewPornstarPage/ViewPornstarBody";
import { ApolloProvider } from "@apollo/client";
import client from "@/apolloClient/apolloClient";
import AuthenticationWrapper from "@/components/utilities/AuthenticationWrapper";

export default function Pornstar() {
  return (
    <ApolloProvider client={client}>
        <AuthenticationWrapper>
          <NonDashboardNavbar />
          <ViewPornstarBody />
        </AuthenticationWrapper>
    </ApolloProvider>
  );
}
