import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ALL_PORNSTARS } from '@/queries/pornstars';
import styles from './PornstarTile.module.scss';
import Image from 'next/image';
import Link from 'next/link';

interface propDefs {
  pornstar_id: number;
  pornstar_name: string;
  pornstar_picture_path: string | null;
  tags: string[];
  demoListTile?: boolean;
  shufflePornstarContainer?: boolean;
}

export default function PornstarTile(props: propDefs) {
  console.log("im ptile", props.pornstar_picture_path)
  return (
      <Link href={props.demoListTile ? 'register' : 'pornstar/' + props.pornstar_id}
        className={`${styles["pornstar-tile-container"]} ${styles[props.shufflePornstarContainer ? 'shufflePornstarContainer' : '']}`}
      >
        {props.pornstar_picture_path ? (
          /*
          <img
            alt="user-uploaded"
            src={props.pornstar_picture_path}
            width={300}
            className={styles['user-uploaded-picture']}
          />
          */
          <Image
          src={props.pornstar_picture_path}
          alt={props.pornstar_name}
          width={300}
            height={450}
          className={styles['user-uploaded-picture']}
        />
        ) : (
          <Image
            src="/silhouette.jpg"
            alt="silhouette"
            width={300}
            height={450}
            className={styles['silhouette-picture']}
          />
        )}
        <div className={styles['pornstar-tile-bottom-container']}>
          <h1 className={styles['pornstar-name']}>{props.pornstar_name}</h1>
          <ul className={styles['pornstar-tags-list']}>
            {props.tags?.slice().sort().map((tag: any) => (
              <li className={styles['pornstar-tags-list-item']}>{tag}</li>
            ))}
          </ul>
        </div>
    </Link>
  );
}
// here is where the edit component should live, next to the button, do the &&
