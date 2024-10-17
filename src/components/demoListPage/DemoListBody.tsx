import React, { useState, ChangeEvent } from "react";
import styles from "./DemoListBody.module.scss";
import PornstarTile from "../dashboardpage/DashboardComponents/PornstarTile";
import DemoListPornstars from "./DemoListPornstars";

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
      <h1 className={styles["header"]}>Demo List</h1>
      <span>
        The images here were AI generated. Feel free to add your own pornstar
        images when you sign up.
      </span>
      <div className={styles["pornstar-tiles-container"]}>
        {DemoListPornstars.map((pornstar: any) => (
          <PornstarTile
            pornstar_id={pornstar.pornstar_id}
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
