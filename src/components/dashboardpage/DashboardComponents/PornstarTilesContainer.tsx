import React from "react";
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
  const { pornstarTags, tagsToggle, nameSearchTerm } =
    usePornstarAndTagsContext();
  const { fullPornstars, pornstarsData, pornstarsLoading, pornstarsError } =
    useFullPornstarsContext();

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

  const realFilterPornstarByTags = fullPornstars.filter((pornstar: any) =>
    pornstarTags.every((FilterTag: string) =>
      pornstar.pornstar_tags_text.some((tag: string) => tag === FilterTag)
    )
  );

  const filteredData = realFilterPornstarByTags.filter((item: any) =>
    item.pornstar_name.toLowerCase().includes(nameSearchTerm.toLowerCase())
  );

  return (
    <>
      <div className={styles["pornstar-tiles-container"]}>
        {(tagsToggle
          ? realFilterPornstarByTags
          : nameSearchTerm || pornstarTags.length !== 0
          ? filteredData
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
          realFilterPornstarByTags.length == 0 &&
          pornstarsData.getAllPornstarsAndTags.length > 0 && (
            <span>No pornstars that match all these tags</span>
          )}
        {!tagsToggle &&
          filteredData.length == 0 &&
          pornstarsData.getAllPornstarsAndTags.length > 0 && (
            <span>No pornstars with this name</span>
          )}
        {pornstarsData.getAllPornstarsAndTags.length == 0 && (
          <Link href={"/resources"} className={styles["resources-copy"]}>
            Your list is empty. Add a pornstar or click here for resources.
          </Link>
        )}
      </div>
    </>
  );
}
