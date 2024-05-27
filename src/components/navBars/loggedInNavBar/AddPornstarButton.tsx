import React, { useState } from "react";
import styles from "./AddPornstarButton.module.scss";
import { useRouter,usePathname } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client";
import { CHECK_SUBSCRIPTION } from "@/queries/subscription";
import { useFullPornstarsContext } from '@/contexts/FullPornstarsContext';
import PornstarLimitUpgradeModal from "./PornstarLimitUpgradeModal";
import ThousandPornstarLimitModal from "./ThousandPornstarLimitModal";

enum Subscription_Status {
  ACTIVE_SUBSCRIPTION = "ACTIVE_SUBSCRIPTION",
  NO_SUBSCRIPTION = "NO_SUBSCRIPTION",
  CANCELLING_SUBSCRIPTION = "CANCELLING_SUBSCRIPTION",
}

interface propDefs {
  optionalProp?: string;
}

// we could do optional prop or we could actually just coniditonally render the string to be diffrent based on screen size
export default function AddPornstarButton({ optionalProp = 'Add Pornstar' } : propDefs) {
  const router = useRouter();

  // need to refetch this query when the user upgrades
  const { loading, error, data } = useQuery(
    CHECK_SUBSCRIPTION
  );

  const {fullPornstars} = useFullPornstarsContext()
  const [pornstarLimitUpgradeModalIsOpen, setPornstarLimitUpgradeModalIsOpen] = useState<boolean>(false);
  const [thousandPornstarLimitModalIsOpen, setThousandPornstarLimitModalIsOpen] = useState<boolean>(false);

  const addPornstarHandler = (e : React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    console.log("number",data.checkSubscription.number_of_pornstars)
    if(data.checkSubscription.subscription_status ===
      Subscription_Status.ACTIVE_SUBSCRIPTION ||
      data.checkSubscription.subscription_status ===
        Subscription_Status.CANCELLING_SUBSCRIPTION)
        {
          console.log("premi", data.checkSubscription.number_of_pornstars)
          if(fullPornstars.length < 1000)
            router.push("/addPornstar");
          else
          setThousandPornstarLimitModalIsOpen(true)
        }
        else
        {
          console.log("free", data.checkSubscription.number_of_pornstars)
          if(fullPornstars.length < 25)
            router.push("/addPornstar");
          else
            setPornstarLimitUpgradeModalIsOpen(true)
        }
    
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error! {error.message}</div>;

  return (
    <>
        <button className={`${styles["header"]} ${styles["add-pornstar"]}`} onClick={addPornstarHandler}>{optionalProp}</button>
      {pornstarLimitUpgradeModalIsOpen && <PornstarLimitUpgradeModal setPornstarLimitUpgradeModalIsOpen={setPornstarLimitUpgradeModalIsOpen} />}
      {thousandPornstarLimitModalIsOpen && <ThousandPornstarLimitModal setThousandPornstarLimitModalIsOpen={setThousandPornstarLimitModalIsOpen} />}
      </>
  )
}
