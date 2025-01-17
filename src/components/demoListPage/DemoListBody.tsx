import React from "react";
import styles from "./DemoListBody.module.scss";
import DemoListPornstarTile from "./DemoListComponents/DemoListPornstarTile";
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
      <ScrollToTop />
      <h1 className={styles["header"]}>Demo List</h1>
      <span className={styles["explain-message"]}>
        This is an example pornstar list. Feel free to create your own and copy
        these tags or images.
      </span>
      <span className={styles["find-pornstars-message"]}>
        You can find these pornstars on{" "}
        <a href="https://join.exotic4k.com/track/ST1MMBwuwPDFWYvhdT8bfM84RRh" target="_blank" className={styles["affiliate-link"]}>
          Exotic4k,
        </a>
        {" "}
        <a href="https://join.puremature.com/track/ST1MMBwuwPDFWYvhdT8bfM84RRh,30" target="_blank" className={styles["affiliate-link"]}>
          PureMature,
        </a>{" "}
        and{" "}
        <a href="https://join.passion-hd.com/track/ST1MMBwuwPDFWYvhdT8bfM84RRh" target="_blank" className={styles["affiliate-link"]}>
          Passion-HD
        </a>
      </span>
      <span className={styles["explain-message"]}>
        or click on the pornstar to go to their scene page.
      </span>
      <div className={styles["pornstar-tiles-container"]}>
        {DemoListPornstars.sort(function (a: any, b: any) {
          return a.pornstar_name
            .toLowerCase()
            .localeCompare(b.pornstar_name.toLowerCase());
        }).map((pornstar: any, index) => (
          <DemoListPornstarTile
            key={Math.floor(Math.random() * 10000)}
            pornstar_url_slug=""
            pornstar_name={pornstar.pornstar_name}
            pornstar_picture_path={pornstar.pornstar_picture_path}
            tags={pornstar.pornstar_tags}
            affiliate_link={pornstar.affiliate_link}
          />
        ))}
      </div>
    </main>
  );
}
