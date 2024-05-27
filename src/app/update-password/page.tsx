'use client'

import React from "react";
import NonDashboardNavbar from '@/components/navBars/nonDashboardNavBar/NonDashboardNavbar';
import UpdatePasswordBody from "@/components/updatePasswordPage/UpdatePasswordBody";
import { ApolloProvider } from "@apollo/client";
import client from "../../apolloClient/apolloClient";
import AuthenticationWrapper from "@/components/utilities/AuthenticationWrapper";

export default function UpdatePassword() {
  return (
    <ApolloProvider client={client}>
      <AuthenticationWrapper>
        <NonDashboardNavbar />
        <UpdatePasswordBody />
      </AuthenticationWrapper>
      </ApolloProvider>
  );
}
