"use client";

import React from "react";
import NonDashboardNavbar from "@/components/navBars/nonDashboardNavBar/NonDashboardNavbar";
import UpdatePaymentBody from "@/components/updatePaymentPage/UpdatePaymentBody";
import { ApolloProvider } from "@apollo/client";
import client from "../../apolloClient/apolloClient";
import AuthenticationWrapper from "@/components/utilities/AuthenticationWrapper";

export default function UpdatePayment() {
  return (
    <ApolloProvider client={client}>
      <AuthenticationWrapper>
        <NonDashboardNavbar />
        <UpdatePaymentBody />
      </AuthenticationWrapper>
    </ApolloProvider>
  );
}
