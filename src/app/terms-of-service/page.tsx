import React from "react";
import TermsBody from "@/components/termsAndConditionPage/TermsBody";
import HomePageNavBar from "@/components/navBars/homePageNavBar/HomePageNavBar";
import Footer from "@/components/homepage/homePageComponents/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions - MyFapSheet",
  description: "Read the Terms and Conditions of MyFapSheet.",
};


export default function termsofservice() {
  return (
    <>
      <HomePageNavBar />
      <TermsBody />
      <Footer />
    </>
  );
}
