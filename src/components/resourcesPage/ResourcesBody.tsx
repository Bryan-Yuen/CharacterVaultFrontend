import React, { useRef } from "react";
import styles from "./ResourcesBody.module.scss";
import Link from "next/link";
import videojs from "video.js";
import VideoJS from "../utilities/VideoJS";
//import 'video.js/dist/video-js.css';

export default function ResourcesBody() {
  const uploadPictureVideoPlayerRef = useRef(null);
  const searchFilterShuffleVideoPlayerRef = useRef(null);

  const uploadPictureVideoJsOptions = {
    autoplay: false,
    controls: true,
    responsive: true,
    fluid: true,
    poster: "https://upload-picture-video.myfapsheet.com/upload-picture-poster.webp",
    sources: [
      {
        src: "https://upload-picture-video.myfapsheet.com/upload-picture-video.mp4",
        type: "video/mp4",
      },
      {
        src: "https://upload-picture-video.myfapsheet.com/upload-picture-video.webm",
        type: "video/webm",
      },
    ],
  };

  const searchFilterShuffleVideoJsOptions = {
    autoplay: false,
    controls: true,
    responsive: true,
    fluid: true,
    poster: "https://search-filter-shuffle-video.myfapsheet.com/search-filter-shuffle-poster.webp",
    sources: [
      {
        src: "https://search-filter-shuffle-video.myfapsheet.com/search-filter-shuffle-video.mp4",
        type: "video/mp4",
      },
      {
        src: "https://search-filter-shuffle-video.myfapsheet.com/search-filter-shuffle-video.webm",
        type: "video/webm",
      },
    ],
  };

  const handleUploadPictureVideoPlayerReady = (player: any) => {
    uploadPictureVideoPlayerRef.current = player;

    // You can handle player events here, for example:
    player.on("waiting", () => {
      videojs.log("player is waiting");
    });

    player.on("dispose", () => {
      videojs.log("player will dispose");
    });
  };

  const handleSearchFilterShuffleVideoPlayerReady = (player: any) => {
    searchFilterShuffleVideoPlayerRef.current = player;

    // You can handle player events here, for example:
    player.on("waiting", () => {
      videojs.log("player is waiting");
    });

    player.on("dispose", () => {
      videojs.log("player will dispose");
    });
  };

  return (
    <main className={styles["resources-body-container"]}>
      <div className={styles["content-container"]}>
        <h1 className={styles["resources-header"]}>Resources</h1>
        <h2
          className={`${styles["resources-subheader"]} ${styles["video-title"]}`}
        >
          Drag and Drop Upload Picture Tutorial
        </h2>
        <div className={styles["video-body-container"]}>
          <VideoJS options={uploadPictureVideoJsOptions} onReady={handleUploadPictureVideoPlayerReady} />
        </div>
        <span className={styles["video-message"]}>
          We recommend uploading pictures on desktop with drag and drop for
          faster adding.
        </span>
        <span className={styles["video-message"]}>
          <a
            href="https://www.pornpics.com/galleries/curvy-mature-ava-addams-sucks-cock-rides-hard-gets-her-big-tits-creamed-37032386/"
            target="_blank"
          >
            Gallery
          </a>{" "}
          used in the video.
        </span>
        <span className={styles["video-message"]}>
          * For Mobile, you will have to manually save the photo and upload from gallery. In the future, we may have upload with image url.
        </span>
        <h2
          className={`${styles["resources-subheader"]} ${styles["video-title"]}`}
        >
          Search Tags Filter and Shuffle Demo
        </h2>
        <div className={styles["video-body-container"]}>
          <VideoJS options={searchFilterShuffleVideoJsOptions} onReady={handleSearchFilterShuffleVideoPlayerReady} />
        </div>
        <span className={styles["video-message"]}>
          If you wake up feeling blonde milfs, you can easily type that in the search filter and see your options. You can also try the shuffle button if you want something random.
        </span>
        <h2 className={`${styles['resources-subheader']} ${styles['demo-list-header']}`}>Demo List</h2>
        <span className={styles["demo-list-content"]}>
          Check out our example pornstar list. Feel free to use our tags or
          create your own.
        </span>
        <Link
          href={"/demo-list"}
          className={styles["demo-list-link"]}
          target="_blank"
        >
          View Demo List
        </Link>
        <h2 className={`${styles['resources-subheader']} ${styles['resources-links-header']}`} >Resource Links</h2>
        <ul className={styles["link-list"]}>
          <li className={styles["link-item"]}>
            <a href="https://pornpics.com/" target="_blank">
              https://pornpics.com/&nbsp;
            </a>
            <span className={styles["link-message"]}>
              (Find pornstar pictures here)
            </span>
          </li>
          <li className={styles["link-item"]}>
            <a href="https://iafd.com/" target="_blank">
              https://iafd.com/&nbsp;
            </a>
            <span className={styles["link-message"]}>
              (Pornstar database, see all films for a pornstar)
            </span>
          </li>
          <li className={styles["link-item"]}>
            <a href="https://reddit.com/r/MyFapSheet/" target="_blank">
            https://reddit.com/r/MyFapSheet/&nbsp;
            </a>
            <span className={styles["link-message"]}>
              (Check out our subreddit for pornstar recommendations)
            </span>
          </li>
          {/* <li className={styles["link-item"]}>
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
          </li>*/}
        </ul>
        <h2 className={styles["resources-subheader"]}>Affiliates</h2>
        <div className={styles["affiliate-links-container"]}>
          <ul className={styles["link-list"]}>
            <li className={styles["link-item"]}>
              <a
                href="https://join.tiny4k.com/track/ST1VREsgbFk5NuV9ZpgjzQjBraQ,22"
                target="_blank"
              >
                Tiny4k
              </a>
            </li>
            <li className={styles["link-item"]}>
              <a
                href="https://join.exotic4k.com/track/ST1VREsgbFk5NuV9ZpgjzQjBraQ"
                target="_blank"
              >
                Exotic4k
              </a>
            </li>
          </ul>{" "}
          <ul className={styles["link-list"]}>
            <li className={styles["link-item"]}>
              <a
                href="https://join.puremature.com/track/ST1VREsgbFk5NuV9ZpgjzQjBraQ,15"
                target="_blank"
              >
                PureMature
              </a>
            </li>
            <li className={styles["link-item"]}>
              <a
                href="https://join.castingcouch-x.com/track/ST1VREsgbFk5NuV9ZpgjzQjBraQ,16"
                target="_blank"
              >
                CastingCouch-X
              </a>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
