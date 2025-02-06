import React from "react";
import styles from "./IntroductionBody.module.scss";
import globalStyles from "@/sharedStyles/global-classes.module.scss";
import Image from "next/image";
import Link from "next/link";

export default function IntroductionBody() {
  return (
      <div className={styles["introduction-body-container"]}>
        <div className={styles["dashboard-image-container"]}>
        <a
          href="https://character-vault-homepage-pictures.charactervault.site/walter-white-example.webp"
          target="_blank"
          className={styles["dashboard-image-link"]}
        >
          <Image
            priority
            src="https://character-vault-homepage-pictures.charactervault.site/walter-white-example.webp"
            alt="walter white"
            height={267}
            width={475}
            unoptimized={true}
            className={styles["dashboard-image"]}
          />
        </a>
        </div>
        <div className={styles["right-side-container"]}>
          <ul className={styles["feature-list"]}>
            <li className={styles["feature"]}>
              <Image
                priority
                src="/image-icon.svg"
                alt="image icon"
                height={100}
                width={300}
                className={styles["image-icon"]}
              />
              <div className={styles["feature-copy-container"]}>
                <h3 className={styles["feature-title"]}>
                  Upload custom images
                </h3>
                <span className={styles["feature-content"]}>
                  Use your favorite character picture you find online.
                </span>
              </div>
            </li>
            <li className={styles["feature"]}>
              <Image
                priority
                src="/tag-icon.svg"
                alt="image icon"
                height={100}
                width={300}
                className={styles["tag-icon"]}
              />
              <div className={styles["feature-copy-container"]}>
                <h3 className={styles["feature-title"]}>Create custom tags</h3>
                <span className={styles["feature-content"]}>
                  Add tags and filter your character by tags.
                </span>
              </div>
            </li>
            <li className={styles["feature"]}>
              <Image
                priority
                src="/link-icon.svg"
                alt="image icon"
                height={100}
                width={300}
                className={styles["link-icon"]}
              />
              <div className={styles["feature-copy-container"]}>
                <h3 className={styles["feature-title"]}>Add video links</h3>
                <span className={styles["feature-content"]}>
                  Save your favorite videos for each character.
                </span>
              </div>
            </li>
          </ul>
        </div>
      </div>
  );
}
