"use client";
import React from "react";
import ReactPlayer from "react-player";
import styles from "./HomePageVideoBody.module.scss";
import Image from "next/image";

export default function HomePageVideoBody() {
  return (
    <div className={styles["video-body-container"]}>
      {/*<iframe width="1000" height="563" src="https://www.youtube.com/embed/ByAn8DF8Ykk?si=CJLc0uSbjKctWrgg" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>*/}
      {/*<iframe className={styles["hero-video"]} width="1000" height="563" src="https://www.youtube.com/embed/ByAn8DF8Ykk?si=LDDCTGREQ4Qnt0um" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>*/}

      <video className={styles["hero-video"]} width="1000" controls>
        <source
          src="https://pub-250210f504394affbc2c93cf1b8da2f7.r2.dev/Timeline%201%20final.mp4#t=0.1"
          type="video/mp4"
        />
        <source
          src="https://pub-250210f504394affbc2c93cf1b8da2f7.r2.dev/Timeline%201%20final.webm"
          type="video/webm"
        />
        <Image
          priority
          src="/MyFapSheetSVG.svg"
          alt="Down Icon"
          height={0}
          width={50}
          className={styles["website-icon"]}
        />
      </video>
    </div>
  );
}
