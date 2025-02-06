//'use client'

import React from "react";
import DemoListBody from "@/components/demoListPage/DemoListBody";
import DemoListNavbar from "@/components/navBars/demoListNavbar/DemoListNavbar";
import { ApolloProvider } from "@apollo/client";
import client from "@/apolloClient/apolloClient";
//import ActorAndTagsContextProvider from "@/contexts/ActorAndTagsContext";
import Footer from "@/components/homepage/homePageComponents/Footer";

// public page even when logged in
export default function DemoList() {
  return (
    <>
    {/*<ApolloProvider client={client}> */}
      {/*<PornstarAndTagsContextProvider> */}
        <DemoListNavbar />
        <DemoListBody />
        <Footer />
      {/*</PornstarAndTagsContextProvider> */}
    {/*</ApolloProvider> */}
    </>
  );
}
