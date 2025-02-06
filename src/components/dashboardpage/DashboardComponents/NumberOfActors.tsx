import React from "react";
import styles from "./NumberOfActors.module.scss";
import { useActorAndTagsContext } from "@/contexts/ActorAndTagsContext";

interface propDefs {
  phone?: boolean;
}

// we could do optional prop or we could actually just coniditonally render the string to be diffrent based on screen size
export default function NumberOfActors({phone} : propDefs) {
    const { tagsToggle, filteredActorByName, filteredActorByTags } =
    useActorAndTagsContext();

  return (
    <div className={styles["number-of-actors-message"]}>Characters: <span className={styles["number"]}>{tagsToggle ? filteredActorByTags.length : filteredActorByName.length}</span></div>
  )
}
