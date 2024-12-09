"use client";

import React, { ReactNode } from 'react'
import { ApolloProvider} from "@apollo/client";
import client from "@/apolloClient/apolloClient";

interface WrapperProps {
  children: ReactNode;
}

// can make this dynamic to wrap props it passes in
export default function ApolloClientWrapper({ children } : WrapperProps) {
  return (
    <ApolloProvider client={client}>
      { children }
    </ApolloProvider>
  )
}
