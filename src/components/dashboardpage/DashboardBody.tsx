import { useState, useEffect } from "react";
import styles from "./DashboardBody.module.scss";
import PornstarTileContainer from "./DashboardComponents/PornstarTilesContainer";
import SearchSelectedTags from "./DashboardComponents/SearchSelectedTags";
import FilteredPornstarsContextProvider from "@/contexts/FullPornstarsContext";
import ShuffleButtonAndPornstar from "./DashboardComponents/ShuffleButtonAndPornstar";
import SearchTagManagerAddPornstarContainer from "../navBars/loggedInNavBar/SearchTagManagerAddPornstarContainer";
import SearchBar from "../navBars/loggedInNavBar/SearchBar";
import Link from "next/link";
import AddPornstarButton from "../navBars/loggedInNavBar/AddPornstarButton";
import SuccessAlertIsOpenContextProvider from "@/contexts/ShowSuccessAlertContext";
import { useSuccessAlertContext } from "@/contexts/ShowSuccessAlertContext";
import SuccessPopUp from "../utilities/SuccessPopUp";

export default function DashboardBody() {
  const [isDesktop, setDesktop] = useState(false);
  const [isPhone, setPhone] = useState(false);
  const { successAlertIsOpen, setSuccessAlertIsOpen } =useSuccessAlertContext();

  useEffect(() => {
    const updateMedia = () => {
      if (window.innerWidth <= 1100 && window.innerWidth > 750) {
        setDesktop(true);
        setPhone(false);
      } else if (window.innerWidth <= 750) {
        setPhone(true);
        setDesktop(false);
      } else {
        setDesktop(false);
        setPhone(false)
      }
    };
    updateMedia();

    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  }, []);

  console.log("successalret",successAlertIsOpen)

  return (
      <div className={styles["dashboard-body"]}>
        {isDesktop && <SearchTagManagerAddPornstarContainer />}
        {isPhone && <SearchBar/>}
        {isPhone && <AddPornstarButton optionalProp="+"/>}
        <ShuffleButtonAndPornstar />
        <SearchSelectedTags />
        <PornstarTileContainer />
        {successAlertIsOpen && < SuccessPopUp/>}
      </div>
  );
}
