import React from 'react'
import styles from './SuccessPopUp.module.scss';
import Image from "next/image";

interface propDefs {
  successText: string;
}

export default function SuccessPopUp({ successText }: propDefs) {
  return (
    <div className={styles['parent']}>
    <div className={styles['pop-up-container']}>  <Image
    priority
    src="/check.png"
    alt="check mark"
    height={20}
    width={20}
  /><span className={styles['success-text']}>{successText}</span></div>
  </div>
  )
}
