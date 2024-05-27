'use client'

import React from "react";
import HomePageNavBar from "@/components/navBars/homePageNavBar/HomePageNavBar";
import ContactPageBody from "@/components/contactPage/ContactPageBody";
import { ApolloProvider } from "@apollo/client";
import client from "../../apolloClient/apolloClient";

export default function contact() {
  return (
    <ApolloProvider client={client}>
      <HomePageNavBar />
      <ContactPageBody />
      </ApolloProvider>
  );
}
