import { Metadata } from "next";
import EmailVerification from "./page";

export const metadata: Metadata = {
  title: "Email Verification - MyActorList",
  description: "Email verification page",
  robots: {
    index: false,
    follow: false,
  },
};
export default EmailVerification;
