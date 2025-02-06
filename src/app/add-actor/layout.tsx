import { Metadata } from "next";
import AddActor from "./page"; // import your Demo's pages

export const metadata: Metadata = {
  title: "Add Actor - MyActorList",
  description: "Add a new actor",
  robots: {
    index: false,
    follow: false,
  },
};
export default AddActor;
