import React, { useState } from "react";
import styles from "./CheckOutNavbar.module.scss";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";


export default function CheckOutNavbar() {
  const router = useRouter();

  const [upgradeModalIsOpen, setUpgradeModalIsOpen] = useState<boolean>(false);

  const [accountDropdownIsOpen, setAccountDropdownIsOpen] = useState<boolean>(false);

  return (
    <div className={styles["navbar"]}>
      <Link
        href={"/dashboard"}
        className={`${styles["header"]} ${styles["website-name-and-icon-container"]}`}
      >
        {" "}
        <Image
          priority
          src="/paper.svg"
          alt="Down Icon"
          height={32}
          width={32}
          className={styles["website-icon"]}
        />
        <h1 className={styles["website-name"]}>MyFapSheet</h1>
      </Link>
    </div>
  );
}
