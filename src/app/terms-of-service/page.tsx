'use client'

import React from "react";
import TermsBody from "@/components/termsAndConditionPage/TermsBody";
import HomePageNavBar from "@/components/navBars/homePageNavBar/HomePageNavBar";
import Footer from "@/components/homepage/homePageComponents/Footer";

export default function termsofservice() {
  return (
    <>
      <HomePageNavBar />
      <TermsBody />
      <Footer />
    </>
  );
}
