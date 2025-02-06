import React, { useState } from "react";
import styles from "./AddActorButton.module.scss";
import { useRouter } from "next/navigation";
import { useFullActorsContext } from "@/contexts/FullActorsContext";
import ActorLimitUpgradeModal from "./ActorLimitUpgradeModal";
import { useMutation, useQuery } from "@apollo/client";
import { GET_USER_PROFILE } from "@/queries/userQueries";

interface propDefs {
  phone?: boolean;
}

// we could do optional prop or we could actually just coniditonally render the string to be diffrent based on screen size
export default function AddActorButton({ phone }: propDefs) {
  const router = useRouter();

  const { fullActors } = useFullActorsContext();
  const [actorLimitUpgradeModalIsOpen, setActorLimitUpgradeModalIsOpen] =
    useState<boolean>(false);

  const { loading, error, data } = useQuery(GET_USER_PROFILE);

  const addActorHandler = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (fullActors.length < 25 || data.getUserProfile.user_is_premium)
      router.push("/add-actor");
    else if (fullActors.length > 1000)
      setActorLimitUpgradeModalIsOpen(true);
    else setActorLimitUpgradeModalIsOpen(true);
  };

  return (
    <>
      <button
        className={`${styles["header"]} ${styles["add-actor"]}`}
        onClick={addActorHandler}
      >
        {phone ? "+" : "Add Character"}
      </button>
      {actorLimitUpgradeModalIsOpen && (
        <ActorLimitUpgradeModal
          setActorLimitUpgradeModalIsOpen={
            setActorLimitUpgradeModalIsOpen
          }
        />
      )}
    </>
  );
}
