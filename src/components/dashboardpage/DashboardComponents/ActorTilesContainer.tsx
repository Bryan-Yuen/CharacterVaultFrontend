import React, {useEffect} from "react";
import styles from "./ActorTilesContainer.module.scss";
import ActorTile from "./ActorTile";
import { useActorAndTagsContext } from "@/contexts/ActorAndTagsContext";
import { useFullActorsContext } from "@/contexts/FullActorsContext";
import Link from "next/link";
import Loading from "@/components/utilities/Loading";
import ErrorMessage from "@/components/utilities/ErrorMessage";

export interface ActorTag {
  tag_text: string;
}

export interface FullActor {
  actor_url_slug: string;
  actor_name: string;
  actor_picture_path: string;
  actor_tags: ActorTag[];
}

export default function ActorTilesContainer() {
  const { actorTags, tagsToggle, nameSearchTerm, filteredActorByName, filteredActorByTags, setFilteredActorByName, setFilteredActorByTags } =
    useActorAndTagsContext();
  const { fullActors, actorsData, actorsLoading, actorsError } =
    useFullActorsContext();

    useEffect(() => {
      const realFilterActorByTags = fullActors.filter((actor: any) =>
        actorTags.every((FilterTag: string) =>
          actor.actor_tags_text.some((tag: string) => tag === FilterTag)
        )
      );
      setFilteredActorByTags(realFilterActorByTags)
    
      const filteredData = filteredActorByTags.filter((item: any) =>
        item.actor_name.toLowerCase().includes(nameSearchTerm.toLowerCase())
      );
      setFilteredActorByName(filteredData)
    },[actorTags,nameSearchTerm,fullActors])

  if (actorsLoading) return <Loading />;
  if (actorsError) {
    if (
      actorsError.graphQLErrors &&
      actorsError.graphQLErrors.length > 0
    ) {
      const errorCode = actorsError.graphQLErrors[0].extensions.code;
      switch (errorCode) {
        case "VERSION_ERROR":
          return (
            <ErrorMessage>
              Version Error. A new web version is available. Please refresh your
              page.
            </ErrorMessage>
          );
        case "RATE_LIMIT_ERROR":
          return (
            <ErrorMessage>
              Too many requests for this resource. Please wait and try again
              again later. Contact support if you think this is was an error.
            </ErrorMessage>
          );
        default:
          return (
            <ErrorMessage>
              Error loading actors. Please refresh the page and try again.
              <br></br>
              If error persists please contact support@myfapsheet.com for help
            </ErrorMessage>
          );
      }
    }
    return (
      <ErrorMessage>
        Error loading actors. Please refresh the page and try again.
        <br></br>
        If error persists please contact support@myfapsheet.com for help
      </ErrorMessage>
    );
  }


  console.log("what is tags",filteredActorByTags)
  return (
    <>
      <div className={styles["actor-tiles-container"]}>
        {(tagsToggle
          ? filteredActorByTags
          : nameSearchTerm || actorTags.length !== 0
          ? filteredActorByName
          : // copy of the default actors if the user didn't type anything in search bar
            [...actorsData.getAllactorsAndTags]
        )
          .sort(function (a: any, b: any) {
            return a.actor_name
              .toLowerCase()
              .localeCompare(b.actor_name.toLowerCase());
          })
          .map((actor: any) => {
            return (
              <ActorTile
                key={actor.actor_url_slug}
                actor_url_slug={actor.actor_url_slug}
                actor_name={actor.actor_name}
                actor_picture_path={actor.actor_picture_path}
                tags={actor.actor_tags_text}
              />
            );
          })}
        {tagsToggle &&
          filteredActorByTags.length == 0 &&
          actorsData.getAllActorsAndTags.length > 0 && (
            <span>No actors that match all these tags</span>
          )}
        {!tagsToggle &&
          filteredActorByName.length == 0 &&
          actorsData.getAllActorsAndTags.length > 0 && (
            <span>No actors with this name</span>
          )}
        {actorsData.getAllActorsAndTags.length == 0 && (
          <div className={styles["empty-actor-list-message-container"]}>
          <span>Welcome to MyFapSheet<br></br> Please go to our <Link href={"/resources"} className={styles["resources-copy"]}>Resources</Link> page to watch a tutorial on <br></br>drag and drop uploading image before adding your first actor.</span>
          </div>
        )}
      </div>
    </>
  );
}
/*
<Link href={"/resources"} className={styles["resources-copy"]}>
Your list is empty. Add a actor or click here for resources.
</Link>
*/
