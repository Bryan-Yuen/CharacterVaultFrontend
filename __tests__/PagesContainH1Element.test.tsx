import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import mockClient from "../__mocks__/apolloClient";
import { ApolloProvider } from "@apollo/client";
import RegisterBody from "@/components/registerpage/RegisterBody";
import LoginBody from "@/components/loginpage/LoginBody";
import HomePageBody from "@/components/homepage/HomePageBody";
import DemoListBody from "@/components/demoListPage/DemoListBody";
import PrivacyBody from "@/components/privacyPolicypage/privacyBody";
import TermsBody from "@/components/termsAndConditionPage/TermsBody";

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

beforeAll(() => {
  global.scrollTo = jest.fn();
});

// components with apollo provider wrapper
const apolloProviderComponents = [
  { name: "RegisterBody", component: RegisterBody },
  { name: "LoginBody", component: LoginBody },
];

describe.each(apolloProviderComponents)("Page Components", ({ name, component }) => {
  it(`renders an <h1> in ${name}`, () => {
    render(
      <ApolloProvider client={mockClient}>
         {React.createElement(component)}
      </ApolloProvider>
    );

    const heading = screen.getByRole("heading", { level: 1 });

    expect(heading).toBeInTheDocument();
  });
});

// components without apollo provider wrapper
const components = [
  { name: "HomePageBody", component: HomePageBody },
  { name: "DemoListBody", component: DemoListBody },
  { name: "PrivacyBody", component: PrivacyBody },
  { name: "TermsBody", component: TermsBody },
  // Add more components here
];

describe.each(components)("Page Components", ({ name, component }) => {
  it(`renders an <h1> in ${name}`, () => {
    render(
      <>
         {React.createElement(component)}
         </>
    );

    const heading = screen.getByRole("heading", { level: 1 });

    expect(heading).toBeInTheDocument();
  });
});
