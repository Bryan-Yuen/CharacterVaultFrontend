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
    poster: "https://character-vault-homepage-pictures.charactervault.site/actor-dashboard-example.webp",
    sources: [
      {
        src: "https://charactervault-homepage-video.charactervault.site/walter-white-demo.mp4",
        type: "video/mp4",
      },
      {
        src: "",
        type: "video/webm",
      },
      {
        src: "",
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
      <h1 className={styles["mobile-homepage-header"]}>
      Create Your Favorite Movie & TV Characters List
          </h1>
      <div className={styles["video-section-container"]}>
        <div className={styles["hero-content-container"]}>
          <h1 className={styles["desktop-homepage-header"]}>
            Create Your Favorite Movie & TV Characters List
          </h1>
          <span className={styles["introduction-body-content"]}>
            Save your favorite TV characters here.
            Manage your favorite TV characters all in one place with our stylish
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
          {/*  <a
          href="https://character-vault-homepage-pictures.charactervault.site/actor-dashboard-example.webp"
          target="_blank"
          className={styles["dashboard-image-link"]}
        >
          <Image
            priority
            src="https://character-vault-homepage-pictures.charactervault.site/actor-dashboard-example.webp"
            alt="walter white"
            height={267}
            width={475}
            unoptimized={true}
            className={styles["dashboard-image"]}
          />
        </a>*/}
        </div>
      </div>
    </>
  );
}
