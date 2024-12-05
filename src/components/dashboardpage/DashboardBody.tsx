import { useState, useEffect } from "react";
import styles from "./DashboardBody.module.scss";
import PornstarTileContainer from "./DashboardComponents/PornstarTilesContainer";
import SearchSelectedTags from "./DashboardComponents/SearchSelectedTags";
import ShuffleButtonAndPornstar from "./DashboardComponents/ShuffleButtonAndPornstar";
import SearchTagManagerAddPornstarContainer from "../navBars/loggedInNavBar/SearchTagManagerAddPornstarContainer";
import SearchBar from "../navBars/loggedInNavBar/SearchBar";
import AddPornstarButton from "../navBars/loggedInNavBar/AddPornstarButton";

export default function DashboardBody() {
  const [isDesktop, setDesktop] = useState(false);
  const [isPhone, setPhone] = useState(false);

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

  return (
      <div className={styles["dashboard-body"]}>
        {isDesktop && <SearchTagManagerAddPornstarContainer />}
        {isPhone && <SearchBar/>}
        {isPhone && <AddPornstarButton/>}
        <ShuffleButtonAndPornstar />
        <SearchSelectedTags />
        <PornstarTileContainer />
      </div>
  );
}
