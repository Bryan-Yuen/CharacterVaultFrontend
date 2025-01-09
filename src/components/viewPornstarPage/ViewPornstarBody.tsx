import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { GET_PORNSTAR } from "@/queries/pornstarsQueries";
import { useQuery } from "@apollo/client";
import styles from "./ViewPornstarBody.module.scss";
import Image from "next/image";
import Link from "next/link";
import DeletePornstarModal from "./DeletePornstarModal";
import Loading from "../utilities/Loading";
import ErrorMessage from "../utilities/ErrorMessage";
import { CDNImageLoader } from "@/components/utilities/CDNImageLoader";
import { PORNSTAR_IMAGE_WIDTH, PORNSTAR_IMAGE_HEIGHT } from '@/constants/constants';

export default function ViewPornstarBody() {
  // read a route's dynamic params filled in by the current URL.
  const params = useParams<{ id: string }>();

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState<boolean>(false);

  const [isDesktop, setDesktop] = useState(false);

  useEffect(() => {
    if (window.innerWidth > 890) {
      setDesktop(true);
    } else {
      setDesktop(false);
    }

    const updateMedia = () => {
      if (window.innerWidth > 890) {
        setDesktop(true);
      } else {
        setDesktop(false);
      }
    };
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  }, []);

  function capitalizeWords(str: string) {
    return str
      .split(" ") // Split the string into an array of words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
      .join(" "); // Join the array back into a string
  }

  const { loading, error, data } = useQuery(GET_PORNSTAR, {
    variables: {
      getPornstarInput: {
        pornstar_url_slug: params.id,
      },
    },
    onCompleted: (data) => {
      document.title =
        capitalizeWords(data.getPornstar.pornstar_name) + " - MyFapSheet";
    },
  });

  if (loading) return <Loading />;
  if (error) {
    if (error.graphQLErrors && error.graphQLErrors.length > 0) {
      const errorCode = error.graphQLErrors[0].extensions.code;
      console.log(error.graphQLErrors);
      switch (errorCode) {
        // scenario if user deleted the pornstar and clicked on the old pornstar link in web browser
        // or if user refreshes the page after error from save button maybe because pornstar is deleted
        case "PORNSTAR_NOT_FOUND":
          //router.push("/dashboard");
          //window.location.reload();
          // we want to refresh page after push to dashboard because user could've clicked on deleted pornstar in dashboard
          window.location.href = "/dashboard";
          return null;
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
              Error loading pornstar data. Please refresh the page and try
              again.
              <br></br>
              If error persists please contact support@myfapsheet.com for help
            </ErrorMessage>
          );
      }
    }
    return (
      <ErrorMessage>
        Error loading pornstar data. Please refresh the page and try again.
        <br></br>
        If error persists please contact support@myfapsheet.com for help
      </ErrorMessage>
    );
  }

  // probably put the width and height in constant
  return (
    <div className={styles["component-container"]}>
      <div className={styles["flex-form-container"]}>
        {isDesktop &&
          (data.getPornstar.pornstar_picture_path ? (
            <Image
              loader={CDNImageLoader}
              alt={data.getPornstar.pornstar_name}
              src={data.getPornstar.pornstar_picture_path}
              width={PORNSTAR_IMAGE_WIDTH}
              height={PORNSTAR_IMAGE_HEIGHT}
              className={styles["user-image"]}
            />
          ) : (
            <Image
              src="/silhouette.jpg"
              alt="silhouette"
              width={PORNSTAR_IMAGE_WIDTH}
              height={PORNSTAR_IMAGE_HEIGHT}
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
                href={"edit/" + params.id}
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
                loader={CDNImageLoader}
                alt={data.getPornstar.pornstar_name}
                src={data.getPornstar.pornstar_picture_path}
                width={PORNSTAR_IMAGE_WIDTH}
                height={PORNSTAR_IMAGE_HEIGHT}
                className={styles["user-image"]}
              />
            ) : (
              <Image
                src="/silhouette.jpg"
                alt="silhouette"
                width={PORNSTAR_IMAGE_WIDTH}
                height={PORNSTAR_IMAGE_HEIGHT}
                className={styles["silhouette-image"]}
              />
            ))}
          <ul className={styles["pornstar-tags-list"]}>
            {data.getPornstar.pornstar_tags?.map((tag: any) => (
              <li
                className={styles["pornstar-tags-list-item"]}
                key={params.id + "-" + tag}
              >
                {tag.pornstar_tag_text}
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
          pornstar_url_slug={data.getPornstar.pornstar_url_slug}
          pornstar_name={data.getPornstar.pornstar_name}
          setModalIsOpen={setDeleteModalIsOpen}
        />
      )}
    </div>
  );
}
