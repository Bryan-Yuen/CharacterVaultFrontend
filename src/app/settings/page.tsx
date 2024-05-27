"use client";

import React from "react";
import NonDashboardNavbar from "@/components/navBars/nonDashboardNavBar/NonDashboardNavbar";
import SettingsBody from "@/components/settingsPage/SettingsBody";
import { ApolloProvider } from "@apollo/client";
import client from "@/apolloClient/apolloClient";
import AuthenticationWrapper from "@/components/utilities/AuthenticationWrapper";

export default function settings() {
  return (
    <ApolloProvider client={client}>
      <AuthenticationWrapper>
        <NonDashboardNavbar />
        <SettingsBody />
      </AuthenticationWrapper>
    </ApolloProvider>
  );
}
