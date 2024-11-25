import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { GET_PORNSTAR } from "@/queries/pornstarsQueries";
import { useMutation, useQuery } from "@apollo/client";
import styles from "./ViewPornstarBody.module.scss";
import Image from "next/image";
import Link from "next/link";
import DeletePornstarModal from "./DeletePornstarModal";
import { ThreeDots } from "react-loader-spinner";

export default function ViewPornstarBody() {
  // read a route's dynamic params filled in by the current URL.
  const params = useParams<{ id: string }>();

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState<boolean>(false);

  const [isDesktop, setDesktop] = useState(false);
  useEffect(() => {
    if (window.innerWidth > 800) {
      setDesktop(true);
    } else {
      setDesktop(false);
    }

    const updateMedia = () => {
      if (window.innerWidth > 800) {
        setDesktop(true);
      } else {
        setDesktop(false);
      }
    };
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  }, []);

  //const pornstarIdValid = typeof searchParams.get('id') === 'string' ? parseInt(searchParams.get('id') ) : -1;
  const pornstarId = typeof params.id === "string" ? parseInt(params.id) : "-1";

  const { loading, error, data } = useQuery(GET_PORNSTAR, {
    variables: {
      getPornstarInput: {
        pornstar_id: pornstarId,
      },
    },
    errorPolicy: "all",
  });

  if (loading)
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
  if (error) return <div>Error! {error.message}</div>;
  console.log("getpornstar");
  console.log(data.getPornstar);
  return (
    <div className={styles["component-container"]}>
      <div className={styles["flex-form-container"]}>
        {isDesktop &&
          (data.getPornstar.pornstar_picture_path ? (
            <Image
              alt={data.getPornstar.pornstar_name}
              src={data.getPornstar.pornstar_picture_path}
              width={300}
              height={450}
              className={styles["user-image"]}
            />
          ) : (
            <Image
              src="/silhouette.jpg"
              alt="silhouette"
              width={300}
              height={450}
              className={styles["silhouette-image"]}
            />
          ))}
        <div className={styles["flex-child-right-side"]}>
          <div className={styles["header-container"]}>
            <h2 className={styles["pornstar-name"]}>
              {data.getPornstar.pornstar_name}
            </h2>
            <div className={styles["buttons-container"]}>
              <Link
                href={"edit/" + pornstarId}
                className={styles["edit-button"]}
              >
                Edit
              </Link>
              <button
                className={styles["delete-button"]}
                onClick={() => setDeleteModalIsOpen(true)}
              >
                Delete
              </button>
            </div>
          </div>
          {!isDesktop &&
            (data.getPornstar.pornstar_picture_path ? (
              <Image
                alt={data.getPornstar.pornstar_name}
                src={data.getPornstar.pornstar_picture_path}
                width={300}
                height={450}
                className={styles["user-image"]}
              />
            ) : (
              <Image
                src="/silhouette.jpg"
                alt="silhouette"
                width={300}
                height={450}
                className={styles["silhouette-image"]}
              />
            ))}
          <ul className={styles["pornstar-tags-list"]}>
            {data.getPornstar.pornstar_tags?.map((tag: any) => (
              <li className={styles["pornstar-tags-list-item"]}>
                {tag.tag_text}
              </li>
            ))}
          </ul>
          <div className={styles["pornstar-links-container"]}>
            <div className={styles["links-header"]}>Links</div>
            <ul className={styles["pornstar-links-list"]}>
              {data.getPornstar.pornstar_links?.map((link: any) => (
                <li className={styles["pornstar-links-list-item"]}>
                  <span className={styles["link-title"]}>
                    {link.pornstar_link_title}
                  </span>
                  <a
                    href={link.pornstar_link_url}
                    target="_blank"
                    className={styles["website-link"]}
                  >
                    {link.pornstar_link_url}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {deleteModalIsOpen && (
        <DeletePornstarModal
          pornstar_id={data.getPornstar.pornstar_id}
          pornstar_name={data.getPornstar.pornstar_name}
          setModalIsOpen={setDeleteModalIsOpen}
        />
      )}
    </div>
  );
}
