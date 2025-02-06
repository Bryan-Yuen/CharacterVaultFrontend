import { Metadata } from "next";
import ChangePassword from "./page";

export const metadata: Metadata = {
  title: "Change Password - MyActorList",
  description: "Change your password",
  robots: {
    index: false,
    follow: false,
  },
};
export default ChangePassword;
