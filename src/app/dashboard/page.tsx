"use client";

import React from "react";
import LoggedInNavbar from "@/components/navBars/loggedInNavBar/LoggedInNavbar";
import DashboardBody from "@/components/dashboardpage/DashboardBody";
import { ApolloProvider } from "@apollo/client";
import client from "@/apolloClient/apolloClient";
import ActorAndTagsContextProvider from "@/contexts/ActorAndTagsContext";
import FilteredActorsContextProvider from "@/contexts/FullActorsContext";
import AuthenticationWrapper from "@/components/utilities/AuthenticationWrapper";
import type { Metadata } from "next";

// there is a way to do add the meta data for title here, just do the same thing in root layout and have the content below as a component.

/*
export const metadata: Metadata = {
  title: "MyFapSheet",
  description: "The place to save your favorite Actors",
};
*/

export default function Dashboard() {
  return (
    <ApolloProvider client={client}>
      <ActorAndTagsContextProvider>
        <FilteredActorsContextProvider>
            <AuthenticationWrapper>
              <LoggedInNavbar />
              <DashboardBody />
            </AuthenticationWrapper>
        </FilteredActorsContextProvider>
      </ActorAndTagsContextProvider>
    </ApolloProvider>
  );
}
