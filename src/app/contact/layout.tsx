import { Metadata } from "next";
import Contact from "./page";

if (!process.env.NEXT_PUBLIC_ENVIRONMENT) {
  throw new Error("no environment");
}

export const metadata: Metadata = {
  title: "Contact - MyFapSheet",
  description: "Contact MyFapSheet. Ask questions about the website.",
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
export default Contact;
