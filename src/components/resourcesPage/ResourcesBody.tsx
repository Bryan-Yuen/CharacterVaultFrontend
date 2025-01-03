import styles from "./ResourcesBody.module.scss";
import Link from "next/link";

import React from "react";

export default function ResourcesBody() {
  return (
    <main className={styles["resources-body-container"]}>
      <div className={styles["content-container"]}>
        <h1 className={styles["resources-header"]}>Resources</h1>
        <div>
          Welcome to MyFapSheet. The purpose of this website was to keep track
          of your favorite pornstars as you discover them. We have custom
          pictures so you can upload a good picture for your pornstar instead
          of using website’s default image. We have a simple tagging system so
          if you wake up feeling tanned latinas, you can add those tags in the
          search bar and it will show all your favorite tanned latina pornstars.
          The add links functionality can be used save your video links for your
          pornstars. We recommend adding a title or studio name in case the
          video gets taken down. Thank you for using our service. More features
          will be coming in the future.
        </div>
        <h2 className={styles["resources-subheader"]}>
          Demo List
        </h2>
        <span className={styles["demo-list-content"]}>Use this list as an example of the kind of tags you could use. Feel free to create your own tags.</span>
        <Link
          href={"/demo-list"}
          className={styles["demo-list-link"]}
          target="_blank"
        >
          View Demo List
        </Link>
        <h2 className={styles["resources-subheader"]}>
          Some pornstars you can add to your list
        </h2>
        <ul className={styles["pornstar-list"]}>
          <li className={styles["pornstar"]}>
            1. Violet Myers - latina, black hair, big ass, big natural tits
          </li>
          <li className={styles["pornstar"]}>
            2. Lia Lin - asian, skinny, black hair, tanned, big ass
          </li>
          <li className={styles["pornstar"]}>
            3. 404hotfound - amateur, european, redhead, big natural tits
          </li>
          <li className={styles["pornstar"]}>
            4. Harmony Wonder - latina, black hair, skinny, teen
          </li>
          <li className={styles["pornstar"]}>
            5. Alexa Vega - latina, big ass, milf, big tits, blonde
          </li>
          <li className={styles["pornstar"]}>
            6. Brittney White - black, big natural tits, black hair
          </li>
          <li className={styles["pornstar"]}>
            7. Darcia Lee - european, black hair, big natural tits
          </li>
          <li className={styles["pornstar"]}>
            8. Aubrey Edible - middle eastern, black hair, teen
          </li>
          <li className={styles["pornstar"]}>
            9. Haily Rose - indian, big natural tits, black hair
          </li>
          <li className={styles["pornstar"]}>
            10. Dava Foxx - white, black hair, big tits, tanned, glasses
          </li>
        </ul>
        <h2 className={styles["resources-subheader"]}>Helpful Links</h2>
        <ul className={styles["link-list"]}>
          <li className={styles["link-item"]}>
            <a href="https://pornpics.com/" target="_blank">
              https://pornpics.com/&nbsp;
            </a>
            <span className={styles["link-message"]}>(good for HD pictures)</span>
          </li>
          <li className={styles["link-item"]}>
            <a href="https://iafd.com/" target="_blank">
              https://iafd.com/&nbsp;
            </a>
            <span className={styles["link-message"]}>(pornstar database, see all films for a
              pornstar)</span>
          </li>
          <li className={styles["link-item"]}>
            <a href="https://iceporncasting.net/" target="_blank">
              https://iceporncasting.net/&nbsp;
            </a>
            <span className={styles["link-message"]}>(free casting videos)</span>
          </li>
          <li className={styles["link-item"]}>
            <a href="https://erothots.co/" target="_blank">
              https://erothots.co/&nbsp;
            </a>
            <span className={styles["link-message"]}>(free onlyfans videos)</span>
          </li>
          <li className={styles["link-item"]}>
            <a href="https://topvid.tv/" target="_blank">
            https://topvid.tv/&nbsp;
            </a>
            <span className={styles["link-message"]}>(free premium videos)</span>
          </li>
          <li className={styles["link-item"]}>
            <a href="https://euroxxx.net/" target="_blank">
              https://euroxxx.net/&nbsp;
            </a>
            <span className={styles["link-message"]}>(free premium videos)</span>
          </li>
        </ul>
      </div>
    </main>
  );
}
