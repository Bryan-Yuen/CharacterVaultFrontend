import React from "react";
import styles from "./DemoListBody.module.scss";
import PornstarTile from "../dashboardpage/DashboardComponents/PornstarTile";
import DemoListPornstars from "./DemoListPornstars";
import ScrollToTop from "../utilities/ScrollToTop";

export interface FullPornstar {
  pornstar_id: number;
  pornstar_name: string;
  pornstar_picture_path: string;
  pornstar_tags: string[];
}

export interface PornstarTag {
  tag_text: string;
}

export default function DemoListBody() {
  //we could actually utilize the full pornstars state if we're keeping it instead of duplicating the logic for tags
  return (
    <main className={styles["demo-list-body"]}>
      {/* nextjs had weird bug that keeps scroll position of previous page, this is temp workaround */}
      <ScrollToTop/>
      <h1 className={styles["header"]}>Demo List</h1>
      <span>
        The images here were AI generated. Feel free to add your own pornstar
        images when you sign up.
      </span>
      <div className={styles["pornstar-tiles-container"]}>
        {DemoListPornstars.map((pornstar: any, index) => (
          <PornstarTile
          key={Math.floor(Math.random() * 10000)}
          pornstar_url_slug=""
            pornstar_name={pornstar.pornstar_name}
            pornstar_picture_path={pornstar.pornstar_picture_path}
            tags={pornstar.pornstar_tags}
            demoListTile={true}
          />
        ))}
      </div>
    </main>
  );
}
