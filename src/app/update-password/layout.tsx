import { Metadata } from "next";
import UpdatePassword from "./page";

if (!process.env.NEXT_PUBLIC_ENVIRONMENT) {
  throw new Error("no environment");
}

export const metadata: Metadata = {
  title: "Update Password - MyFapSheet",
  description: "Update your password",
  robots: {
    index: false,
    follow: false,
  },
};
export default UpdatePassword;
