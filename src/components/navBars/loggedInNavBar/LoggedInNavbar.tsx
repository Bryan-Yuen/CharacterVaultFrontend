import React, { useState, useEffect } from "react";
import styles from "./LoggedInNavbar.module.scss";
import Link from "next/link";
import Image from "next/image";
import { useRouter,usePathname } from "next/navigation";
import AccountDropdown from "./AccountDropdown";
import { useQuery, useMutation } from "@apollo/client";
import { CHECK_SUBSCRIPTION } from "@/queries/subscription";
import SearchTagManagerAddPornstarContainer from "./SearchTagManagerAddPornstarContainer";
import { ThreeDots } from 'react-loader-spinner'

export default function LoggedInNavbar() {
  const pathname = usePathname()

  const [accountDropdownIsOpen, setAccountDropdownIsOpen] = useState<boolean>(false);

    // need to refetch this query when the user upgrades
    const { loading, error, data } = useQuery(
      CHECK_SUBSCRIPTION
    );

    const [isDesktop, setDesktop] = useState(false);

    useEffect(() => {
      const updateMedia = () => {
        if (window.innerWidth > 1100) {
          setDesktop(true);
        } else {
          setDesktop(false);
        }
      };
      updateMedia();

      window.addEventListener('resize', updateMedia);
      return () => window.removeEventListener('resize', updateMedia);
    }, []);

  // refresh page on top left title click
  const handleLinkClick = (e: any) => {
    // Check if the current route is already '/dashboard'
    if (pathname === "/dashboard") {
      e.preventDefault(); // Prevent the default link behavior
      window.location.reload(); // Reload the page
    }
  };

  if (loading) return <ThreeDots
  visible={true}
  height="80"
  width="80"
  color="rgb(22, 122, 207);"
  radius="9"
  ariaLabel="three-dots-loading"
  wrapperStyle={{}}
  wrapperClass=""
  />;
  if (error) return <div>Error! {error.message}</div>;

  return (
    <>
    <div className={styles["navbar"]}>
      <Link
        href={"/dashboard"}
        className={`${styles["header"]} ${styles["website-name-and-icon-container"]}`}
        onClick={handleLinkClick}
      >
        {" "}
        <Image
              priority
              src="/MyFapSheetSVG.svg"
              alt="Down Icon"
              height={0}
              width={32}
              className={styles["website-icon"]}
            />
        <h1 className={styles["website-name"]}>MyFapSheet</h1>
      </Link>
      {isDesktop && <SearchTagManagerAddPornstarContainer/>}
      <div className={styles["upgrade-button-profile-icon-container"]}>
        <button className={`${styles['account-button']} ${styles[accountDropdownIsOpen ? 'account-dropdown-active' : '']}`} onClick={() => setAccountDropdownIsOpen(true)}>
          <Image
            priority
            src="/profile-picture-svg.svg"
            alt="Down Icon"
            height={32}
            width={32}
          />
        </button>
      </div>
    </div>
    {accountDropdownIsOpen && <AccountDropdown setDropdownIsOpen={setAccountDropdownIsOpen} />}
    </>
  );
}
