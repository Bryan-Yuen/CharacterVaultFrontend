import { Metadata } from "next";
import Register from "./page";

if (!process.env.NEXT_PUBLIC_ENVIRONMENT) {
  throw new Error("no environment");
}

export const metadata: Metadata = {
  title: "Register - MyFapSheet",
  description: "Register for a new account",
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
export default Register;
