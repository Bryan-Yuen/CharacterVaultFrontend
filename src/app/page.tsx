//import styles from "@/styles/Home.module.scss";
import NavBar from "@/components/navBars/homePageNavBar/HomePageNavBar";
import Footer from "@/components/homepage/homePageComponents/Footer";
import HomePageBody from "@/components/homepage/HomePageBody";
import ApolloClientWrapper from "@/components/utilities/ApolloClientWrapper";
import HomePageAuthenticationWrapper from "@/components/utilities/HomePageAuthenticationWrapper";
import type { Metadata } from "next";

if (!process.env.NEXT_PUBLIC_ENVIRONMENT) {
  throw new Error("no environment");
}

export const metadata: Metadata = {
  title: "MyFapSheet - Create your pornstar list",
  description:
    "Create your list and add and manage your favorite pornstars. Upload custom images, tags, and video links.",
  robots: {
    index:
      process.env.NEXT_PUBLIC_ENVIRONMENT === "LOCAL_DEVELOPMENT" ||
      process.env.NEXT_PUBLIC_ENVIRONMENT === "DEVELOPMENT"
        ? false
        : true,
    follow:
      process.env.NEXT_PUBLIC_ENVIRONMENT === "LOCAL_DEVELOPMENT" ||
      process.env.NEXT_PUBLIC_ENVIRONMENT === "DEVELOPMENT"
        ? false
        : true,
  },
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
