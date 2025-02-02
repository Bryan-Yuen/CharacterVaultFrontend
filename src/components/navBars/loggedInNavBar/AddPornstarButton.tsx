import React, { useState } from "react";
import styles from "./AddPornstarButton.module.scss";
import { useRouter } from "next/navigation";
import { useFullPornstarsContext } from "@/contexts/FullPornstarsContext";
import PornstarLimitUpgradeModal from "./PornstarLimitUpgradeModal";
import { useMutation, useQuery } from "@apollo/client";
import { GET_USER_PROFILE } from "@/queries/userQueries";

interface propDefs {
  phone?: boolean;
}

// we could do optional prop or we could actually just coniditonally render the string to be diffrent based on screen size
export default function AddPornstarButton({ phone }: propDefs) {
  const router = useRouter();

  const { fullPornstars } = useFullPornstarsContext();
  const [pornstarLimitUpgradeModalIsOpen, setPornstarLimitUpgradeModalIsOpen] =
    useState<boolean>(false);

  const { loading, error, data } = useQuery(GET_USER_PROFILE);

  const addPornstarHandler = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (fullPornstars.length < 25 || data.getUserProfile.user_is_premium)
      router.push("/add-pornstar");
    else if (fullPornstars.length > 1000)
      setPornstarLimitUpgradeModalIsOpen(true);
    else setPornstarLimitUpgradeModalIsOpen(true);
  };

  return (
    <>
      <button
        className={`${styles["header"]} ${styles["add-pornstar"]}`}
        onClick={addPornstarHandler}
      >
        {phone ? "+" : "Add Pornstar"}
      </button>
      {pornstarLimitUpgradeModalIsOpen && (
        <PornstarLimitUpgradeModal
          setPornstarLimitUpgradeModalIsOpen={
            setPornstarLimitUpgradeModalIsOpen
          }
        />
      )}
    </>
  );
}
