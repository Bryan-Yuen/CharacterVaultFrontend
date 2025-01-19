import React from "react";
import styles from "./MobileBottomAdBanner.module.scss";
import Image from "next/image";

export default function MobileBottomAdBanner() {
  return (
    <a
      className={styles["mobile-affiliate-banner-link"]}
      href="http://join.tiny4k.com/track/ST1MSr7NqHtkyDj3eK77rRrArWo"
      target="_blank"
    >
      <Image
        className={styles["mobile-affiliate-banner-image"]}
        src="https://ad-banners.myfapsheet.com/mobile-tiny4k-banner.jpg"
        width="900"
        height="250"
        alt="tiny4k advertisement banner"
      />
    </a>
  );
}
