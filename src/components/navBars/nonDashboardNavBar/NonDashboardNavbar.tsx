import React,{useState} from 'react';
import styles from './NonDashboardNavbar.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import AccountDropdown from "../loggedInNavBar/AccountDropdown";

export default function NonDashboardNavbar() {
  const [accountDropdownIsOpen, setAccountDropdownIsOpen] = useState<boolean>(false);

  return (
    <>
    <div className={styles['navbar']}>
        <Link
          href={'/dashboard'}
          className={`${styles['header']} ${styles['website-name-and-icon-container']}`}
        >
          {' '}
          <Image
              priority
              src="/MyFapSheetSVG.svg"
              alt="paper with droplets"
              height={0}
              width={0}
              className={styles["website-icon"]}
            />
          <div className={styles['website-name']}>MyFapSheet</div>
        </Link>
        <button className={`${styles['account-button']} ${styles[accountDropdownIsOpen ? 'account-dropdown-active' : '']}`} onClick={() => setAccountDropdownIsOpen(true)}>
          <Image
            priority
            src="/profile-picture-svg.svg"
            alt="profile icon"
            height={32}
            width={32}
          />
        </button>
    </div>
    {accountDropdownIsOpen && <AccountDropdown setDropdownIsOpen={setAccountDropdownIsOpen} />}
    </>
  );
}
