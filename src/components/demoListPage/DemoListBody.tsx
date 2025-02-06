import React from "react";
import styles from "./DemoListBody.module.scss";
import DemoListActorTile from "./DemoListComponents/DemoListActorTile";
import DemoListActors from "./DemoListActors";
import ScrollToTop from "../utilities/ScrollToTop";
import globalStyles from "@/sharedStyles/global-classes.module.scss";
import Link from "next/link";

export interface Fullactor {
  actor_id: number;
  actor_name: string;
  actor_picture_path: string;
  actor_tags: string[];
}

export interface actorTag {
  tag_text: string;
}

export default function DemoListBody() {
  //we could actually utilize the full actors state if we're keeping it instead of duplicating the logic for tags
  return (
    <main className={styles["demo-list-body"]}>
      {/* nextjs had weird bug that keeps scroll position of previous page, this is temp workaround */}
      <ScrollToTop />
      <h1 className={styles["header"]}>Demo List</h1>
      <span className={styles["explain-message"]}>
        This is an example actor list. Feel free to create your own and copy
        these tags or images.
      </span>
      <div className={styles["actor-tiles-container"]}>
        {DemoListActors.sort(function (a: any, b: any) {
          return a.actor_name
            .toLowerCase()
            .localeCompare(b.actor_name.toLowerCase());
        }).map((actor: any, index) => (
          <DemoListActorTile
            key={actor.actor_id}
            actor_url_slug=""
            actor_name={actor.actor_name}
            actor_picture_path={actor.actor_picture_path}
            tags={actor.actor_tags}
          />
        ))}
      </div>
      <span className={styles["bottom-demo-list-message"]}>
        Create your character list now
      </span>
      <Link
            href={"/register"}
            className={`${globalStyles["blue-link-button"]} ${styles["bottom-demo-list-cta"]}`}
            prefetch={false}
          >
            Create Your List
          </Link>
    </main>
  );
}
