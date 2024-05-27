import React, { useState } from "react";
import styles from "./SearchTagManagerAddPornstarContainer.module.scss";
import Link from "next/link";
import SearchBar from './SearchBar';
import AddPornstarButton from "./AddPornstarButton";

export default function SearchTagManagerAddPornstarContainer() {
  return (
    <div className={styles["middle-container"]}>
        <Link
          href={"/tagManager"}
          className={`${styles["header"]} ${styles["tag-manager"]}`}
        >
          Tag Manager
        </Link>
        <SearchBar />
        <AddPornstarButton/>
      </div>
  )
}
