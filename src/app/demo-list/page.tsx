'use client'

import React from "react";
import DemoListBody from "@/components/demoListPage/DemoListBody";
import DemoListNavbar from "@/components/navBars/demoListNavbar/DemoListNavbar";
import { ApolloProvider } from "@apollo/client";
import client from "@/apolloClient/apolloClient";
import PornstarAndTagsContextProvider from "@/contexts/PornstarAndTagsContext";

export default function DemoList() {
  return (
    <ApolloProvider client={client}>
      <PornstarAndTagsContextProvider>
        <DemoListNavbar />
        <DemoListBody />
      </PornstarAndTagsContextProvider>
    </ApolloProvider>
  );
}
