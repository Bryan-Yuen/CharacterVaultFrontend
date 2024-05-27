import React from 'react';
import styles from './PornstarLimitUpgradeModal.module.scss';
import Link from 'next/link';

interface propDefs {
  setThousandPornstarLimitModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ThousandPornstarLimitModal(props: propDefs) {
  
  return (
    <div
      className={styles['backdrop']}
      onClick={() => props.setThousandPornstarLimitModalIsOpen(false)}
    >
      <div className={styles['modal']} onClick={(e) => e.stopPropagation()}>
      <button
            onClick={() => props.setThousandPornstarLimitModalIsOpen(false)}
            className={styles['close']}
          >
            &#10006;
          </button>
          <div className={styles['modal-title']}>Pornstar Limit Reached</div>
        <div className={styles['modal-content']}>
          Thank you for your interest in our service. We did not think anyone would reach this point. Unfortunately, our service is capped at this limit for now so you will have to delete some pornstars to free up space. We may increase the limit in the future. Feel free to shoot us an email if you saw this message!
        </div>
      </div>
    </div>
  );
}
