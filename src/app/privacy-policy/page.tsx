import React from "react";
import PrivacyBody from "@/components/privacyPolicypage/privacyBody";
import HomePageNavBar from "@/components/navBars/homePageNavBar/HomePageNavBar";
import Footer from "@/components/homepage/homePageComponents/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - MyFapSheet",
  description: "Read the Privacy Policy of MyFapSheet.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function privacyPolicy() {
  return (
    <>
      <HomePageNavBar />
      <PrivacyBody />
      <Footer />
    </>
  );
}
