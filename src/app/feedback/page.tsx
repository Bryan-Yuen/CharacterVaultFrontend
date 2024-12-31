"use client";

import React from "react";
import NonDashboardNavbar from "@/components/navBars/nonDashboardNavBar/NonDashboardNavbar";
import FeedbackBody from "@/components/feedbackPage/FeedbackBody";
import { ApolloProvider } from "@apollo/client";
import client from "../../apolloClient/apolloClient";
import AuthenticationWrapper from "@/components/utilities/AuthenticationWrapper";

export default function Feedback() {
  return (
    <ApolloProvider client={client}>
      <AuthenticationWrapper>
        <NonDashboardNavbar />
        <FeedbackBody />
      </AuthenticationWrapper>
    </ApolloProvider>
  );
}
