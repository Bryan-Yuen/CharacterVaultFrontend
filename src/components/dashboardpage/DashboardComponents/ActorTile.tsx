import React from 'react';
import styles from './ActorTile.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import { ACTOR_IMAGE_WIDTH, ACTOR_IMAGE_HEIGHT } from '@/constants/constants';

interface propDefs {
  actor_url_slug: string;
  actor_name: string;
  actor_picture_path: string | null;
  tags: string[];
  shuffleActorContainer?: boolean;
}

export default function actorTile(props: propDefs) {

  console.log("tags",props.tags)
  return (
      <Link href={'actor/' + props.actor_url_slug}
        className={`${styles["actor-tile-container"]} ${styles[props.shuffleActorContainer ? 'shuffleActorContainer' : '']}`}
      >
        {props.actor_picture_path ? (
        <Image
        //loader={CDNImageLoader}
          unoptimized={true}
          src={props.actor_picture_path}
          alt={props.actor_name}
          width={ACTOR_IMAGE_WIDTH}
            height={ACTOR_IMAGE_HEIGHT}
          className={styles['user-uploaded-picture']}
        />
        ) : (
          <Image
            src="/silhouette.jpg"
            alt="silhouette"
            width={ACTOR_IMAGE_WIDTH}
            height={ACTOR_IMAGE_HEIGHT}
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
