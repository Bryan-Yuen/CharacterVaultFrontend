import React from "react";
import styles from "./HomePageVideoBody.module.scss";

export default function HomePageVideoBody() {
  return (
    <div className={styles["video-body-container"]}>
      {/*<iframe width="1000" height="563" src="https://www.youtube.com/embed/ByAn8DF8Ykk?si=CJLc0uSbjKctWrgg" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>*/}
      <iframe className={styles["hero-video"]} width="1000" height="563" src="https://www.youtube.com/embed/ByAn8DF8Ykk?si=LDDCTGREQ4Qnt0um" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
    </div>
  );
}
