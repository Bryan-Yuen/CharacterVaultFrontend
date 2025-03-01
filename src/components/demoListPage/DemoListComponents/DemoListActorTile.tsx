import React from 'react';
import styles from './DemoListActorTile.module.scss';
import Image from 'next/image';
import Link from "next/link";

interface propDefs {
  actor_url_slug: string;
  actor_name: string;
  actor_picture_path: string | null;
  tags: string[];
  shuffleActorContainer?: boolean;
}

export default function DemoListActorTile(props: propDefs) {
  return (
      <Link href={"/register"}
        className={`${styles["actor-tile-container"]} ${styles[props.shuffleActorContainer ? 'shuffleactorContainer' : '']}`}
      >
        {props.actor_picture_path ? (
          /*
          <img
            alt="user-uploaded"
            src={props.actor_picture_path}
            width={300}
            className={styles['user-uploaded-picture']}
          />
          */
          <Image
          src={props.actor_picture_path}
          alt={props.actor_name}
          width={320}
            height={480}
            unoptimized
          className={styles['user-uploaded-picture']}
        />
        ) : (
          <Image
            src="/silhouette.jpg"
            alt="silhouette"
            width={320}
            height={480}
            className={styles['silhouette-picture']}
            priority
          />
        )}
        <div className={styles['actor-tile-bottom-container']}>
          <h2 className={styles['actor-name']}>{props.actor_name}</h2>
          <ul className={styles['actor-tags-list']}>
            {props.tags?.slice().sort().map((tag: any) => (
              <li className={styles['actor-tags-list-item']} key={props.actor_url_slug + "-" + tag}>{tag}</li>
            ))}
          </ul>
        </div>
    </Link>
  );
}
// here is where the edit component should live, next to the button, do the &&
