'use client'

import React from "react";
import NonDashboardNavbar from '@/components/navBars/nonDashboardNavBar/NonDashboardNavbar';
import ChangeEmailBody from "@/components/changeEmailPage/ChangeEmailBody";
import { ApolloProvider } from "@apollo/client";
import client from "../../apolloClient/apolloClient";
import AuthenticationWrapper from "@/components/utilities/AuthenticationWrapper";

export default function ChangeEmail() {
  return (
    <ApolloProvider client={client}>
      <AuthenticationWrapper>
        <NonDashboardNavbar/>
        <ChangeEmailBody />
      </AuthenticationWrapper>
      </ApolloProvider>
  );
}
