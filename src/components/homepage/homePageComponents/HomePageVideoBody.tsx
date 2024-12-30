"use client";

import React, { useRef, useEffect } from 'react';
import ReactPlayer from "react-player";
import styles from "./HomePageVideoBody.module.scss";
import Image from "next/image";
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import VideoJS from './VideoJS';


export default function HomePageVideoBody() {
  const playerRef = React.useRef(null);

  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    poster: 'https://home-page-pictures.myfapsheet.com/home-page-video-poster.png',
    sources: [{
      src: 'https://home-page-video.myfapsheet.com/Timeline%201%20final.mp4',
      type: 'video/mp4'
    }]
  };

  const handlePlayerReady = (player : any) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on('waiting', () => {
      videojs.log('player is waiting');
    });

    player.on('dispose', () => {
      videojs.log('player will dispose');
    });
  };

  return (
    <div className={styles["video-body-container"]}>
      {/*<iframe width="1000" height="563" src="https://www.youtube.com/embed/ByAn8DF8Ykk?si=CJLc0uSbjKctWrgg" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>*/}
      {/*<iframe className={styles["hero-video"]} width="1000" height="563" src="https://www.youtube.com/embed/ByAn8DF8Ykk?si=LDDCTGREQ4Qnt0um" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>*/}
{/*      <video className={styles["hero-video"]} width="1000" controls>
        <source
          src="https://home-page-video.myfapsheet.com/Timeline%201%20final.mp4#t=0.1"
          type="video/mp4"
        />
        <source
          src="https://home-page-video.myfapsheet.com/Timeline%201%20final.webm"
          type="video/webm"
        />
        <source
          src="https://home-page-video.myfapsheet.com/Timeline-1-final.ogg"
          type="video/ogg"
        />
        Your browser does not support the video tag.
      </video> */}
      <VideoJS options={videoJsOptions} onReady={handlePlayerReady}/>
    </div>
  );
}
