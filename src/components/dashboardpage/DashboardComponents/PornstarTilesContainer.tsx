import React from "react";
import { useQuery} from "@apollo/client";
import { GET_ALL_PORNSTARS_AND_TAGS } from "@/queries/pornstars";
import styles from "./PornstarTilesContainer.module.scss";
import PornstarTile from "./PornstarTile";
import { usePornstarAndTagsContext } from "@/contexts/PornstarAndTagsContext";
import { useFullPornstarsContext } from "@/contexts/FullPornstarsContext";
import { ThreeDots } from "react-loader-spinner";
import Link from "next/link";


export interface Pornstar {
  pornstar_id: number;
  pornstar_name: string;
  pornstar_picture_path: string;
}

export interface PornstarTag {
  tag_text: string;
}

export interface FullPornstar {
  pornstar_id: number;
  pornstar_name: string;
  pornstar_picture_path: string;
  pornstar_tags: PornstarTag[];
}

export default function PornstarTilesContainer() {
  console.log("pornstartilecontainer has mounted")

  /*
  const {
    loading: pornstarsLoading,
    error: pornstarsError,
    data: pornstarsData,
  } = useQuery(GET_ALL_PORNSTARS_AND_TAGS, {
    onCompleted: (data) => {
      setFullPornstars(data.getAllPornstarsAndTags);
    },
  });
  */

  const { pornstarTags, tagsToggle, nameSearchTerm } =
    usePornstarAndTagsContext();
  const { fullPornstars, setFullPornstars, pornstarsData, pornstarsLoading, pornstarsError } = useFullPornstarsContext();
  // will be filtered by name by the search bar
  //const [fullPornstars, setFullPornstars] = useState<FullPornstar[]>([]);

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

  console.log(pornstarsData);
  console.log("pornstardata and  container refresh");

  //console.log('ptags', pornstarTags);
  console.log("contextttttt", fullPornstars);

  const realFilterPornstarByTags = fullPornstars.filter((pornstar: any) =>
    pornstarTags.every((FilterTag: string) =>
      pornstar.pornstar_tags_text.some((tag: string) => tag === FilterTag)
    )
  );
  console.log("real", realFilterPornstarByTags);
  //console.log('see', fullPornstars);

  const filteredData = realFilterPornstarByTags.filter((item: any) =>
    item.pornstar_name.toLowerCase().includes(nameSearchTerm.toLowerCase())
  );

  console.log("what is fullporn", fullPornstars);

  //we could actually utilize the full pornstars state if we're keeping it instead of duplicating the logic for tags
  return (
    <>
      <div className={styles["pornstar-tiles-container"]}>
        {(tagsToggle
          ? realFilterPornstarByTags
          : nameSearchTerm || pornstarTags.length !== 0
          ? filteredData
          : pornstarsData.getAllPornstarsAndTags
        )
          .sort(function (a: any, b: any) {
            return a.pornstar_name
              .toLowerCase()
              .localeCompare(b.pornstar_name.toLowerCase());
          })
          .map((pornstar: any) => {
            return (
              <PornstarTile
                key={pornstar.pornstar_id}
                pornstar_id={pornstar.pornstar_id}
                pornstar_name={pornstar.pornstar_name}
                pornstar_picture_path={pornstar.pornstar_picture_path}
                tags={pornstar.pornstar_tags_text}
              />
            );
          })}
        {pornstarsData.getAllPornstarsAndTags.length == 0 &&         <Link href={"/resources"} className={styles["resources-copy"]}>
        Your list is empty. Add a pornstar or click here for resources.
        </Link>}
      </div>
    </>
  );
}
