import { Metadata } from "next";
import TagManager from "./page";

export const metadata: Metadata = {
  title: "Tag Manager - Character Vault",
  description: "Manage your account tags",
  robots: {
    index: false,
    follow: false,
  },
};
export default TagManager;
