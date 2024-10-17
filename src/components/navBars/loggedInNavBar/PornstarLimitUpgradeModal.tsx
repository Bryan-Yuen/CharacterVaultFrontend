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
          Thank you for your interest in using MyFapSheet. Unfortunately 25 pornstars is the limit for now. The premium plan for up to 1000 pornstars for $3.99/month will be coming soon.
        </div>
        <button
            onClick={() => props.setPornstarLimitUpgradeModalIsOpen(false)}
            className={styles['upgrade-link-button']}
          >
            Close
          </button>
      </div>
    </div>
  );
}
