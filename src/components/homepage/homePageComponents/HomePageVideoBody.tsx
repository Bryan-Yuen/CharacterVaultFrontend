"use client";

import React, { useRef } from "react";
import styles from "./HomePageVideoBody.module.scss";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import VideoJS from "../../utilities/VideoJS";
import Image from "next/image";
import Link from "next/link";
import globalStyles from "@/sharedStyles/global-classes.module.scss";

export default function HomePageVideoBody() {
  const playerRef = useRef(null);

  const videoJsOptions = {
    autoplay: false,
    controls: true,
    responsive: true,
    fluid: true,
    poster: "https://home-page-pictures.myfapsheet.com/hero-video-poster.webp",
    sources: [
      {
        src: "https://home-page-video.myfapsheet.com/myfapsheet-homepage-ad-video.mp4",
        type: "video/mp4",
      },
      {
        src: "https://home-page-video.myfapsheet.com/myfapsheet-homepage-ad-video.webm",
        type: "video/webm",
      },
      {
        src: "https://home-page-video.myfapsheet.com/myfapsheet-homepage-ad-video.ogg",
        type: "video/ogg",
      },
    ],
  };

  const handlePlayerReady = (player: any) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on("waiting", () => {
      videojs.log("player is waiting");
    });

    player.on("dispose", () => {
      videojs.log("player will dispose");
    });
  };

  return (
    <>
      <a
        className={styles["mobile-affiliate-banner-link"]}
        href="https://join.exotic4k.com/track/ST1XXobpejFuXMLKkGaQLmr2qwS"
        target="_blank"
      >
        <Image
          className={styles["mobile-affiliate-banner-image"]}
          src="https://ad-banners.myfapsheet.com/mobile-exotic4k-banner.jpg"
          width="900"
          height="250"
          alt="exotic4k advertisement banner"
          id="mobile-exotic4k-banner"
        />
      </a>
      <h1 className={styles["mobile-homepage-header"]}>
            Create Your Pornstar List
          </h1>
      <div className={styles["video-section-container"]}>
        <div className={styles["hero-content-container"]}>
          <h1 className={styles["desktop-homepage-header"]}>
            Create Your Pornstar List
          </h1>
          <span className={styles["introduction-body-content"]}>
            Stop writing your pornstars on a notes app and save them here.
            Manage your favorite pornstars all in one place with our stylish
            dashboard.
          </span>
          {/*page scrolls up when pressing back button from another link, and its probably because of prefetch when links come into viewport*/}
          <div className={styles["hero-ctas-container"]}>
            <Link
              href={"/demo-list"}
              className={`${styles["hero-view-demo-list-cta"]}`}
              prefetch={false}
            >
              View Demo List
            </Link>
            <Link
              href={"/register"}
              className={`${globalStyles["blue-link-button"]} ${styles["hero-create-your-list-cta"]}`}
              prefetch={false}
            >
              Create Your List
            </Link>
          </div>
        </div>
        <div className={styles["video-body-container"]}>
          <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
        </div>
      </div>
    </>
  );
}
