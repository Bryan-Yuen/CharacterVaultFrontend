'use client'

import React from "react";
import NonDashboardNavbar from "@/components/navBars/nonDashboardNavBar/NonDashboardNavbar";
import CancellationConfirmedBody from "@/components/cancellationConfirmedPage/CancellationConfirmedBody";
import { ApolloProvider } from "@apollo/client";
import client from "../../apolloClient/apolloClient";

export default function CancellationConfirmed() {
  return (
    <ApolloProvider client={client}>
      <NonDashboardNavbar />
      <CancellationConfirmedBody />
      </ApolloProvider>
  );
}
