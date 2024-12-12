import React from 'react';
import styles from './PornstarTile.module.scss';
import Image from 'next/image';
import Link from 'next/link';

interface propDefs {
  pornstar_url_slug: string;
  pornstar_name: string;
  pornstar_picture_path: string | null;
  tags: string[];
  demoListTile?: boolean;
  shufflePornstarContainer?: boolean;
}

export default function PornstarTile(props: propDefs) {
  console.log("pornstar name",props.pornstar_name)
  return (
      <Link href={props.demoListTile ? 'register' : 'pornstar/' + props.pornstar_url_slug}
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
            priority
          />
        )}
        <div className={styles['pornstar-tile-bottom-container']}>
          <h1 className={styles['pornstar-name']}>{props.pornstar_name}</h1>
          <ul className={styles['pornstar-tags-list']}>
            {props.tags?.slice().sort().map((tag: any) => (
              <li className={styles['pornstar-tags-list-item']} key={props.pornstar_url_slug + "-" + tag}>{tag}</li>
            ))}
          </ul>
        </div>
    </Link>
  );
}
// here is where the edit component should live, next to the button, do the &&
