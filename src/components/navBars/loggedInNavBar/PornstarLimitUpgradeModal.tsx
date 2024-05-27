import React from 'react';
import styles from './PornstarLimitUpgradeModal.module.scss';
import Link from 'next/link';

interface propDefs {
  setPornstarLimitUpgradeModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function PornstarLimitUpgradeModal(props: propDefs) {
  
  return (
    <div
      className={styles['backdrop']}
      onClick={() => props.setPornstarLimitUpgradeModalIsOpen(false)}
    >
      <div className={styles['modal']} onClick={(e) => e.stopPropagation()}>
      <button
            onClick={() => props.setPornstarLimitUpgradeModalIsOpen(false)}
            className={styles['close']}
          >
            &#10006;
          </button>
          <div className={styles['modal-title']}>Pornstar Limit Reached</div>
        <div className={styles['modal-content']}>
          You have reached the maximum 25 pornstars for our free plan. Please consider upgrading to increase the limit to 1,000 or deleting pornstars to free up space.
        </div>
        <Link
          href={"/upgrade"}
          className={`${styles["upgrade-link-button"]}`}
        >
          Upgrade
        </Link>
      </div>
    </div>
  );
}
