import React, { useState, useEffect } from "react";
import { useFullPornstarsContext } from "@/contexts/FullPornstarsContext";
import { usePornstarAndTagsContext } from "@/contexts/PornstarAndTagsContext";
import PornstarTile from "./PornstarTile";
import styles from "./ShuffleButtonAndPornstar.module.scss";
import Link from "next/link";
import { ThreeDots } from "react-loader-spinner";

export default function ShuffleButtonAndPornstar() {
  const { fullPornstars, pornstarsLoading, pornstarsError } = useFullPornstarsContext();

  const { pornstarTags } = usePornstarAndTagsContext();
  const [randomIndex, setRandomIndex] = useState<number>(0);
  const [buttonClicked, setButtonClicked] = useState(false);

  useEffect(() => {
    setButtonClicked(false);
  }, [pornstarTags]);

  const realFilterPornstarByTags = fullPornstars.filter((pornstar: any) =>
    pornstarTags.every((tag: string) => pornstar.pornstar_tags_text.includes(tag))
  );

  function handleOnClickShuffle() {
    console.log("whats in here", realFilterPornstarByTags);
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * realFilterPornstarByTags.length);
    } while (newIndex === randomIndex);

    setRandomIndex(newIndex);
    if (!buttonClicked) {
      setButtonClicked(true);
    }
  }

  function handleOnClickHide() {
    if (buttonClicked) setButtonClicked(false);
  }

  console.log("lengthhh", realFilterPornstarByTags.length);
  console.log(randomIndex);
  if (pornstarsLoading)
    return (
      <ThreeDots
        visible={true}
        height="80"
        width="80"
        color="rgb(22, 122, 207);"
        radius="9"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    );
  if (pornstarsError) return <div>Error! {pornstarsError.message}</div>;
  return (
    <div className={styles["shuffle-button-and-pornstar-container"]}>
      <div className={styles["buttons-container"]}>
        <Link
            href={"/tagManager"}
            className={`${styles["header"]} ${styles["tag-manager"]}`}
          >
            Tag Manager
          </Link>
          {realFilterPornstarByTags.length > 0 &&
            randomIndex < realFilterPornstarByTags.length &&
            buttonClicked && (
              <button
                className={styles["hide-button"]}
                onClick={handleOnClickHide}
              >
                Hide
              </button>
            )}
          <button
            className={styles["shuffle-button"]}
            onClick={handleOnClickShuffle}
          >
            Shuffle
          </button>
          {/* (randomIndex < realFilterPornstarByTags.length) is used when the use presses shuffle first
           then adds more tags, the random index will be out of bounds of realFilterPornstarByTags*/}
      </div>
      {realFilterPornstarByTags.length > 0 &&
        randomIndex < realFilterPornstarByTags.length &&
        buttonClicked && (
          <div className={styles["shuffle-pornstar-container"]}>
            <PornstarTile
              pornstar_id={realFilterPornstarByTags[randomIndex].pornstar_id}
              pornstar_name={
                realFilterPornstarByTags[randomIndex].pornstar_name
              }
              pornstar_picture_path={
                realFilterPornstarByTags[randomIndex].pornstar_picture_path
              }
              tags={realFilterPornstarByTags[randomIndex].pornstar_tags_text}
              shufflePornstarContainer={true}
            />
          </div>
        )}
    </div>
  );
}
