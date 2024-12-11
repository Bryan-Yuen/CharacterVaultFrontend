import React from "react";
import styles from "./FeaturesBody.module.scss";
import Image from "next/image";
import Link from "next/link";

export default function FeaturesBody() {
  return (
    <div className={styles["introduction-body-container"]}>
      <div className={styles["left-side-container"]}>
        <ul className={styles["feature-list"]}>
          <li className={styles["feature"]}><h3 className={styles["feature-title"]}>Upload custom images</h3><span className={styles["feature-content"]}>Use your favorite pornstar picture you find online.</span></li>
          <li className={styles["feature"]}><h3 className={styles["feature-title"]}>Create custom tags</h3><span className={styles["feature-content"]}>Add tags and filter your pornstars by tags.</span></li>
          <li className={styles["feature"]}><h3 className={styles["feature-title"]}>Add video links</h3><span className={styles["feature-content"]}>Save your favorite videos of each pornstars.</span></li>
        </ul>
      </div>
      <Image
        priority
        src="https://home-page-pictures.myfapsheet.com/pornstar-example.png"
        alt="example pornstar page"
        height={267}
        width={475}
        className={styles["edit-pornstar-image"]}
      />
    </div>
  );
}
