import React, { useState } from "react";
import styles from "./AddPornstarButton.module.scss";
import { useRouter,usePathname } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client";
import { CHECK_SUBSCRIPTION } from "@/queries/subscription";
import { useFullPornstarsContext } from '@/contexts/FullPornstarsContext';
import PornstarLimitUpgradeModal from "./PornstarLimitUpgradeModal"

interface propDefs {
  optionalProp?: string;
}

// we could do optional prop or we could actually just coniditonally render the string to be diffrent based on screen size
export default function AddPornstarButton({ optionalProp = 'Add Pornstar' } : propDefs) {
  const router = useRouter();

  const {fullPornstars} = useFullPornstarsContext()
  const [pornstarLimitUpgradeModalIsOpen, setPornstarLimitUpgradeModalIsOpen] = useState<boolean>(false);
  const [thousandPornstarLimitModalIsOpen, setThousandPornstarLimitModalIsOpen] = useState<boolean>(false);

  const addPornstarHandler = (e : React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if(fullPornstars.length < 25)
      router.push("/addPornstar");
    else
      setPornstarLimitUpgradeModalIsOpen(true)
  };

  return (
    <>
        <button className={`${styles["header"]} ${styles["add-pornstar"]}`} onClick={addPornstarHandler}>{optionalProp}</button>
      {pornstarLimitUpgradeModalIsOpen && <PornstarLimitUpgradeModal setPornstarLimitUpgradeModalIsOpen={setPornstarLimitUpgradeModalIsOpen} />}
      </>
  )
}
