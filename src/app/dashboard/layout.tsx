import { Metadata } from "next";
import Dashboard from "./page";

export const metadata: Metadata = {
  title: "Dashboard - MyActorList",
  description: "Dashboard to view your actors",
  robots: {
    index: false,
    follow: false,
  },
};
export default Dashboard;
