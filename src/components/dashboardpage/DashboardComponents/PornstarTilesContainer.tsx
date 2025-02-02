import React, {useEffect} from "react";
import styles from "./PornstarTilesContainer.module.scss";
import PornstarTile from "./PornstarTile";
import { usePornstarAndTagsContext } from "@/contexts/PornstarAndTagsContext";
import { useFullPornstarsContext } from "@/contexts/FullPornstarsContext";
import Link from "next/link";
import Loading from "@/components/utilities/Loading";
import ErrorMessage from "@/components/utilities/ErrorMessage";

export interface PornstarTag {
  tag_text: string;
}

export interface FullPornstar {
  pornstar_url_slug: string;
  pornstar_name: string;
  pornstar_picture_path: string;
  pornstar_tags: PornstarTag[];
}

export default function PornstarTilesContainer() {
  const { pornstarTags, tagsToggle, nameSearchTerm, filteredPornstarByName, filteredPornstarByTags, setFilteredPornstarByName, setFilteredPornstarByTags } =
    usePornstarAndTagsContext();
  const { fullPornstars, pornstarsData, pornstarsLoading, pornstarsError } =
    useFullPornstarsContext();

    useEffect(() => {
      const realFilterPornstarByTags = fullPornstars.filter((pornstar: any) =>
        pornstarTags.every((FilterTag: string) =>
          pornstar.pornstar_tags_text.some((tag: string) => tag === FilterTag)
        )
      );
      setFilteredPornstarByTags(realFilterPornstarByTags)
    
      const filteredData = filteredPornstarByTags.filter((item: any) =>
        item.pornstar_name.toLowerCase().includes(nameSearchTerm.toLowerCase())
      );
      setFilteredPornstarByName(filteredData)
    },[pornstarTags,nameSearchTerm,fullPornstars])

  if (pornstarsLoading) return <Loading />;
  if (pornstarsError) {
    if (
      pornstarsError.graphQLErrors &&
      pornstarsError.graphQLErrors.length > 0
    ) {
      const errorCode = pornstarsError.graphQLErrors[0].extensions.code;
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
              Error loading pornstars. Please refresh the page and try again.
              <br></br>
              If error persists please contact support@myfapsheet.com for help
            </ErrorMessage>
          );
      }
    }
    return (
      <ErrorMessage>
        Error loading pornstars. Please refresh the page and try again.
        <br></br>
        If error persists please contact support@myfapsheet.com for help
      </ErrorMessage>
    );
  }


  console.log("what is tags",filteredPornstarByTags)
  return (
    <>
      <div className={styles["pornstar-tiles-container"]}>
        {(tagsToggle
          ? filteredPornstarByTags
          : nameSearchTerm || pornstarTags.length !== 0
          ? filteredPornstarByName
          : // copy of the default pornstars if the user didn't type anything in search bar
            [...pornstarsData.getAllPornstarsAndTags]
        )
          .sort(function (a: any, b: any) {
            return a.pornstar_name
              .toLowerCase()
              .localeCompare(b.pornstar_name.toLowerCase());
          })
          .map((pornstar: any) => {
            return (
              <PornstarTile
                key={pornstar.pornstar_url_slug}
                pornstar_url_slug={pornstar.pornstar_url_slug}
                pornstar_name={pornstar.pornstar_name}
                pornstar_picture_path={pornstar.pornstar_picture_path}
                tags={pornstar.pornstar_tags_text}
              />
            );
          })}
        {tagsToggle &&
          filteredPornstarByTags.length == 0 &&
          pornstarsData.getAllPornstarsAndTags.length > 0 && (
            <span>No pornstars that match all these tags</span>
          )}
        {!tagsToggle &&
          filteredPornstarByName.length == 0 &&
          pornstarsData.getAllPornstarsAndTags.length > 0 && (
            <span>No pornstars with this name</span>
          )}
        {pornstarsData.getAllPornstarsAndTags.length == 0 && (
          <div className={styles["empty-pornstar-list-message-container"]}>
          <span>Welcome to MyFapSheet<br></br> Please go to our <Link href={"/resources"} className={styles["resources-copy"]}>Resources</Link> page to watch a tutorial on <br></br>drag and drop uploading image before adding your first pornstar.</span>
          </div>
        )}
      </div>
    </>
  );
}
/*
<Link href={"/resources"} className={styles["resources-copy"]}>
Your list is empty. Add a pornstar or click here for resources.
</Link>
*/
