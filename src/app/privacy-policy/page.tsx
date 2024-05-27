'use client'

import React from "react";
import PrivacyBody from "@/components/privacyPolicypage/privacyBody";
import HomePageNavBar from "@/components/navBars/homePageNavBar/HomePageNavBar";
import Footer from "@/components/homepage/homePageComponents/Footer";

export default function privacyPolicy() {
  return (
    <>
      <HomePageNavBar />
      <PrivacyBody />
      <Footer />
    </>
  );
}
