import { useState, useEffect } from "react";
import styles from "./DashboardBody.module.scss";
import ActorTileContainer from "./DashboardComponents/ActorTilesContainer";
import SearchSelectedTags from "./DashboardComponents/SearchSelectedTags";
import ShuffleButtonAndActor from "./DashboardComponents/ShuffleButtonAndActor";
import SearchTagManagerAddActorContainer from "../navBars/loggedInNavBar/SearchTagManagerAddActorContainer";
import SearchBar from "../navBars/loggedInNavBar/SearchBar";
import AddActorButton from "../navBars/loggedInNavBar/AddActorButton";
import { useSuccessAlertContext } from "@/contexts/ShowSuccessAlertContext";
import SuccessPopUp from "../utilities/SuccessPopUp";
import NumberOfActors from "./DashboardComponents/NumberOfActors";

export default function DashboardBody() {
  const [isDesktop, setDesktop] = useState(false);
  const [isPhone, setPhone] = useState(false);
  const { successAlertIsOpen, successText, triggeredFrom, setSuccessAlertIsOpen } = useSuccessAlertContext();

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
        setPhone(false);
      }
    };
    updateMedia();

    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  }, []);

    useEffect(() => {
      if (triggeredFrom !== "DASHBOARD")
        setSuccessAlertIsOpen(false)
    }, []);

  return (
    <div className={styles["dashboard-body"]}>
      {successAlertIsOpen && <SuccessPopUp successText={successText} />}
      <NumberOfActors/>
      {isDesktop && <SearchTagManagerAddActorContainer />}
      {isPhone && <SearchBar />}
      {isPhone && <AddActorButton phone={true}/>}
      <ShuffleButtonAndActor />
      <SearchSelectedTags />
      <ActorTileContainer />
    </div>
  );
}
