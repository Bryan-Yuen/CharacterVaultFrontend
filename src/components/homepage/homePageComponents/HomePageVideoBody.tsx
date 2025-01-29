"use client";

import React, { useRef } from "react";
import styles from "./HomePageVideoBody.module.scss";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import VideoJS from "../../utilities/VideoJS";
import Image from "next/image";

export default function HomePageVideoBody() {
  const playerRef = useRef(null);

  const videoJsOptions = {
    autoplay: false,
    controls: true,
    responsive: true,
    fluid: true,
    poster:
      "https://home-page-pictures.myfapsheet.com/homepage-video-poster.webp",
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
      <h1 className={styles["homepage-header"]}>Create Your Pornstar List</h1>
      <div className={styles["video-section-container"]}>
        <a
          className={styles["affiliate-banner-link"]}
          href="https://join.tiny4k.com/track/ST1MSr7NqHtkyDj3eK77rRrArWo"
          target="_blank"
        >
          <Image
            className={styles["affiliate-banner-image"]}
            src="https://ad-banners.myfapsheet.com/desktop-tiny4k-banner.jpg"
            width="160"
            height="562"
            alt="tiny4k advertisement banner"
            id="desktop-tiny4k-banner"
          />
        </a>
        <div className={styles["video-body-container"]}>
          <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
        </div>
        <a
          className={styles["affiliate-banner-link"]}
          href="https://join.exotic4k.com/track/ST1MSr7NqHtkyDj3eK77rRrArWo"
          target="_blank"
        >
          <Image
            className={styles["affiliate-banner-image"]}
            src="https://ad-banners.myfapsheet.com/desktop-exotic4k-banner.jpg"
            width="160"
            height="562"
            alt="exotic4k advertisement banner"
            id="desktop-exotic4k-banner"
          />
        </a>
      </div>
    </>
  );
}
