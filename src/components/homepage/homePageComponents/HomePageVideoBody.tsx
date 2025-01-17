"use client";

import React, { useRef } from "react";
import styles from "./HomePageVideoBody.module.scss";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import VideoJS from "./VideoJS";

export default function HomePageVideoBody() {
  const playerRef = useRef(null);

  const videoJsOptions = {
    autoplay: false,
    controls: true,
    responsive: true,
    fluid: true,
    poster:
      "https://home-page-pictures.myfapsheet.com/home-page-video-poster.webp",
    sources: [
      {
        src: "https://home-page-video.myfapsheet.com/Timeline%201%20final.mp4",
        type: "video/mp4",
      },
      {
        src: "https://home-page-video.myfapsheet.com/Timeline%201%20final.webm",
        type: "video/webm",
      },
      {
        src: "https://home-page-video.myfapsheet.com/Timeline-1-final.ogg",
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
    <div className={styles["video-section-container"]}>
      <a
      className={styles["affiliate-banner-link"]}
        href="http://join.tiny4k.com/track/ST1MSr7NqHtkyDj3eK77rRrArWo"
        target="_blank"
      >
        <img
        className={styles["affiliate-banner-image"]}
          src="https://cdn.fuckyoucash.com/uploads/banner/image/4819/1720.jpg"
          width="160"
          height="562"
        />
      </a>
      <div className={styles["video-body-container"]}>
        <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
      </div>
      <a
      className={styles["affiliate-banner-link"]}
        href="http://join.exotic4k.com/track/ST1MSr7NqHtkyDj3eK77rRrArWo"
        target="_blank"
      >
        <img
        className={styles["affiliate-banner-image"]}
          src="https://cdn.fuckyoucash.com/uploads/banner/image/4940/1767.jpg"
          width="160"
          height="562"
        />
      </a>
    </div>
  );
}
