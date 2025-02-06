import React, { useState } from "react";
import styles from "./SearchTagManagerAddActorContainer.module.scss";
import Link from "next/link";
import SearchBar from './SearchBar';
import AddActorButton from "./AddActorButton";

export default function SearchTagManagerAddActorContainer() {
  return (
    <div className={styles["middle-container"]}>
        <Link
          href={"/tag-manager"}
          className={`${styles["header"]} ${styles["tag-manager"]}`}
        >
          Tag Manager
        </Link>
        <SearchBar />
        <AddActorButton/>
      </div>
  )
}
