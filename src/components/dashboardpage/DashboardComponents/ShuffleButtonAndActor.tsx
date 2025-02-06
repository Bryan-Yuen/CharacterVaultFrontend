import React, { useState, useEffect } from "react";
import { useFullActorsContext } from "@/contexts/FullActorsContext";
import { useActorAndTagsContext } from "@/contexts/ActorAndTagsContext";
import ActorTile from "./ActorTile";
import styles from "./ShuffleButtonAndActor.module.scss";
import Link from "next/link";

export default function ShuffleButtonAndactor() {
  const { fullActors, actorsLoading, actorsError } =
    useFullActorsContext();

  const { actorTags } = useActorAndTagsContext();
  const [randomIndex, setRandomIndex] = useState<number>(0);
  const [buttonClicked, setButtonClicked] = useState(false);

  useEffect(() => {
    setButtonClicked(false);
  }, [actorTags]);

  console.log("actortags",actorTags)

  const realFilterActorByTags = fullActors.filter((actor: any) =>
    actorTags.every((tag: string) =>
      actor.actor_tags_text.includes(tag)
    )
  );

  function handleOnClickShuffle() {
    let newIndex;
    // if actors length is 1, run only 1 time
    do {
      newIndex = Math.floor(Math.random() * realFilterActorByTags.length);
    } while (newIndex === randomIndex && realFilterActorByTags.length > 1);

    setRandomIndex(newIndex);
    if (!buttonClicked) {
      setButtonClicked(true);
    }
  }

  function handleOnClickHide() {
    if (buttonClicked) setButtonClicked(false);
  }

  // actorTilesContainer has the same query and they both always run at the same time so that one will do show the loading and error
  if (actorsLoading) return <></>;
  if (actorsError) return <></>;
  return (
    <div className={styles["shuffle-button-and-actor-container"]}>
      <div className={styles["buttons-container"]}>
        <Link
          href={"/tag-manager"}
          className={`${styles["header"]} ${styles["tag-manager"]}`}
        >
          Tag Manager
        </Link>
        {realFilterActorByTags.length > 0 &&
          randomIndex < realFilterActorByTags.length &&
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
        {/* (randomIndex < realFilteractorByTags.length) is used when the use presses shuffle first
           then adds more tags, the random index will be out of bounds of realFilteractorByTags*/}
      </div>
      {realFilterActorByTags.length > 0 &&
        randomIndex < realFilterActorByTags.length &&
        buttonClicked && (
          <div className={styles["shuffle-actor-container"]}>
            <ActorTile
              actor_url_slug={realFilterActorByTags[randomIndex].actor_url_slug}
              actor_name={
                realFilterActorByTags[randomIndex].actor_name
              }
              actor_picture_path={
                realFilterActorByTags[randomIndex].actor_picture_path
              }
              tags={realFilterActorByTags[randomIndex].actor_tags_text}
              shuffleActorContainer={true}
            />
          </div>
        )}
    </div>
  );
}
