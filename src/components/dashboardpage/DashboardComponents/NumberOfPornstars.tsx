import React from "react";
import styles from "./NumberOfPornstars.module.scss";
import { useFullPornstarsContext } from "@/contexts/FullPornstarsContext";

interface propDefs {
  phone?: boolean;
}

// we could do optional prop or we could actually just coniditonally render the string to be diffrent based on screen size
export default function NumberOfPornstars({phone} : propDefs) {
  const { fullPornstars } = useFullPornstarsContext();

  return (
    <div className={styles["number-of-pornstars-message"]}>Pornstars: <span className={styles["number"]}>{fullPornstars.length}/25</span></div>
  )
}
