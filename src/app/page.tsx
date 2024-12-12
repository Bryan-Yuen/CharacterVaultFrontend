//import styles from "@/styles/Home.module.scss";
import NavBar from "@/components/navBars/homePageNavBar/HomePageNavBar";
import Footer from "@/components/homepage/homePageComponents/Footer";
import HomePageBody from "@/components/homepage/HomePageBody";
import ApolloClientWrapper from "@/components/utilities/ApolloClientWrapper";
import HomePageAuthenticationWrapper from "@/components/utilities/HomePageAuthenticationWrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MyFapSheet",
  description: "Save your favorite pornstars",
};

export default function Home() {
  return (
    <ApolloClientWrapper>
      <HomePageAuthenticationWrapper>
      <NavBar />
      <HomePageBody />
      <Footer />
      </HomePageAuthenticationWrapper>
      </ApolloClientWrapper>
  );
}
