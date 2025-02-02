import React from "react";
import styles from "./NumberOfPornstars.module.scss";
import { usePornstarAndTagsContext } from "@/contexts/PornstarAndTagsContext";

interface propDefs {
  phone?: boolean;
}

// we could do optional prop or we could actually just coniditonally render the string to be diffrent based on screen size
export default function NumberOfPornstars({phone} : propDefs) {
    const { tagsToggle, filteredPornstarByName, filteredPornstarByTags } =
      usePornstarAndTagsContext();

  return (
    <div className={styles["number-of-pornstars-message"]}>Pornstars: <span className={styles["number"]}>{tagsToggle ? filteredPornstarByTags.length : filteredPornstarByName.length}</span></div>
  )
}
