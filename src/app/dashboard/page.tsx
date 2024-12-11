"use client";

import React from "react";
import LoggedInNavbar from "@/components/navBars/loggedInNavBar/LoggedInNavbar";
import DashboardBody from "@/components/dashboardpage/DashboardBody";
import { ApolloProvider } from "@apollo/client";
import client from "@/apolloClient/apolloClient";
import PornstarAndTagsContextProvider from "@/contexts/PornstarAndTagsContext";
import FilteredPornstarsContextProvider from "@/contexts/FullPornstarsContext";
import AuthenticationWrapper from "@/components/utilities/AuthenticationWrapper";

export default function dashboard() {
  return (
    <ApolloProvider client={client}>
      <PornstarAndTagsContextProvider>
        <FilteredPornstarsContextProvider>
            <AuthenticationWrapper>
              <LoggedInNavbar />
              <DashboardBody />
            </AuthenticationWrapper>
        </FilteredPornstarsContextProvider>
      </PornstarAndTagsContextProvider>
    </ApolloProvider>
  );
}
