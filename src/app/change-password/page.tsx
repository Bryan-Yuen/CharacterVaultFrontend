'use client'

import React from "react";
import NonDashboardNavbar from '@/components/navBars/nonDashboardNavBar/NonDashboardNavbar';
import ChangePasswordBody from "@/components/changePasswordPage/ChangePasswordBody";
import { ApolloProvider } from "@apollo/client";
import client from "../../apolloClient/apolloClient";
import { Suspense } from 'react'

// the public change password page after the password reset link
export default function changePassword() {
  return (
    <ApolloProvider client={client}>
      <NonDashboardNavbar />
      <Suspense>
      <ChangePasswordBody />
      </Suspense>
      </ApolloProvider>
  );
}
