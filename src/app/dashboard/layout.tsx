import { Metadata } from "next";
import Dashboard from "./page";

export const metadata: Metadata = {
  title: "Dashboard - Character Vault",
  description: "Dashboard to view your characters",
  robots: {
    index: false,
    follow: false,
  },
};
export default Dashboard;
