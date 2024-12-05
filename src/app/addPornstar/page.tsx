"use client";

import React from "react";
import NonDashboardNavbar from "@/components/navBars/nonDashboardNavBar/NonDashboardNavbar";
import AddPornstarBody from "@/components/addPornstarPage/AddPornstarBody";
import { ApolloProvider } from "@apollo/client";
import client from "@/apolloClient/apolloClient";
import AuthenticationWrapper from "@/components/utilities/AuthenticationWrapper";
import SuccessAlertIsOpenContextProvider from "@/contexts/ShowSuccessAlertContext";

export default function addPornstar() {
  return (
    <ApolloProvider client={client}>
      <SuccessAlertIsOpenContextProvider>
        <AuthenticationWrapper>
          <NonDashboardNavbar />
          <AddPornstarBody />
        </AuthenticationWrapper>
      </SuccessAlertIsOpenContextProvider>
    </ApolloProvider>
  );
}
