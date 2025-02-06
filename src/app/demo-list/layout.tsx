import { Metadata } from "next";
import DemoList from "./page";

if (!process.env.NEXT_PUBLIC_ENVIRONMENT) {
  throw new Error("no environment");
}

export const metadata: Metadata = {
  title: "Demo List - Character Vault",
  description: "MyActorList example list with Actors.",
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
export default DemoList;
