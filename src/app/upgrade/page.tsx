"use client";

import React from "react";
import UpgradeBody from "@/components/upgradePage/UpgradeBody";
import { ApolloProvider } from "@apollo/client";
import client from "../../apolloClient/apolloClient";
import NonDashboardNavbar from "@/components/navBars/nonDashboardNavBar/NonDashboardNavbar";
import AuthenticationWrapper from "@/components/utilities/AuthenticationWrapper";
import SubscriptionPageWrapper from "@/components/utilities/SubscriptionPageWrapper";

export default function upgrade() {
  return (
    <ApolloProvider client={client}>
      <AuthenticationWrapper>
        <SubscriptionPageWrapper>
        <NonDashboardNavbar />
        <UpgradeBody />
        </SubscriptionPageWrapper>
      </AuthenticationWrapper>
    </ApolloProvider>
  );
}
