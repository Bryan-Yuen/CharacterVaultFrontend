"use client";

import React from "react";
import LoggedInNavbar from "@/components/navBars/loggedInNavBar/LoggedInNavbar";
import DashboardBody from "@/components/dashboardpage/DashboardBody";
import { ApolloProvider, useQuery } from "@apollo/client";
import client from "@/apolloClient/apolloClient";
import PornstarAndTagsContextProvider from "@/contexts/PornstarAndTagsContext";
import FilteredPornstarsContextProvider from "@/contexts/FullPornstarsContext";
import SuccessAlertIsOpenContextProvider from "@/contexts/ShowSuccessAlertContext";
import AuthenticationWrapper from "@/components/utilities/AuthenticationWrapper";

export default function dashboard() {
  return (
    <ApolloProvider client={client}>
      <PornstarAndTagsContextProvider>
        <FilteredPornstarsContextProvider>
          <SuccessAlertIsOpenContextProvider>
            <AuthenticationWrapper>
              <LoggedInNavbar />
              <DashboardBody />
            </AuthenticationWrapper>
          </SuccessAlertIsOpenContextProvider>
        </FilteredPornstarsContextProvider>
      </PornstarAndTagsContextProvider>
    </ApolloProvider>
  );
}
