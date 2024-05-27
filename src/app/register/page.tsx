'use client'

import React from 'react'
import RegisterBody from '@/components/registerpage/RegisterBody'
import {ApolloProvider} from '@apollo/client';
import client from "@/apolloClient/apolloClient";
import ApolloClientWrapper from "@/components/utilities/ApolloClientWrapper";
import HomePageAuthenticationWrapper from "@/components/utilities/HomePageAuthenticationWrapper";

export default function register() {
  return (
    <ApolloProvider client={client}>
      <ApolloClientWrapper>
      <HomePageAuthenticationWrapper>
      <RegisterBody/>
      </HomePageAuthenticationWrapper>
      </ApolloClientWrapper>
    </ApolloProvider>
  )
}
