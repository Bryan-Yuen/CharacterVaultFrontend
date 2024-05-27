"use client";

import React from "react";
import NonDashboardNavbar from "@/components/navBars/nonDashboardNavBar/NonDashboardNavbar";
import OrderConfirmedBody from "@/components/orderConfirmedPage/OrderConfirmedBody";
import { ApolloProvider } from "@apollo/client";
import client from "../../apolloClient/apolloClient";
import AuthenticationWrapper from "@/components/utilities/AuthenticationWrapper";

export default function orderConfirmed() {
  return (
    <ApolloProvider client={client}>
      <AuthenticationWrapper>
        <NonDashboardNavbar />
        <OrderConfirmedBody />
      </AuthenticationWrapper>
    </ApolloProvider>
  );
}
