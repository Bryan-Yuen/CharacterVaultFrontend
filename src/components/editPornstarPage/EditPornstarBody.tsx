import React, { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { GET_PORNSTAR } from "@/queries/pornstarsQueries";
import { useMutation, useQuery } from "@apollo/client";
import styles from "./EditPornstarBody.module.scss";
import useInput from "../hooks/useInput";
import { useApolloClient } from "@apollo/client";
import { EDIT_PORNSTAR } from "@/mutations/pornstarMutations";
import { gql } from "@apollo/client";
import UploadImage from "../pornstarInputComponents/UploadImage";
import Tags from "../pornstarInputComponents/Tags";
import PornstarName from "../pornstarInputComponents/PornstarName";
import Link from "next/link";
import MobileUploadImage from "../pornstarInputComponents/MobileUploadImage";
import { RotatingLines } from "react-loader-spinner";
import Loading from "../utilities/Loading";
import ErrorMessage from "../utilities/ErrorMessage";
import GenericError from "../utilities/GenericError";
import MutationVersionError from "../utilities/MutationVersionError";
import RateLimitError from "../utilities/RateLimitError";
import { useSuccessAlertContext } from "@/contexts/ShowSuccessAlertContext";
import "dotenv/config";

if (!process.env.NEXT_PUBLIC_CLOUDFLARE_UPLOAD_WORKER_URL) {
  throw new Error("no cloudflare upload worker url");
}

export enum ImageUpdateStatus {
  AddOrEdit = "ADD_OR_EDIT",
  Delete = "DELETE",
  NoChange = "NO_CHANGE",
}

export interface ImageUpdates {
  didChange: boolean;
  didDelete: boolean;
}

export interface PornstarAndTagsReturn {
  getPornstar: {
    pornstar: any;
    tags: any;
  };
}

export interface EditPornstarLinkObj {
  pornstar_link_id: number;
  pornstar_link_title: string;
  pornstar_link_url: string;
}

export default function EditPornstarBody() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

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
    errorPolicy: "all",
    onCompleted: (data) => {
      document.title =
        "Edit - " +
        capitalizeWords(data.getPornstar.pornstar_name) +
        " - MyFapSheet";
      setPornstarTags(
        data.getPornstar.pornstar_tags.map((tag: any) => tag.pornstar_tag_text)
      );
      setPornstarName(data.getPornstar.pornstar_name);
      setPornstarLinks(data.getPornstar.pornstar_links);
    },
  });

  const client = useApolloClient();

  const {
    input: pornstarName,
    inputIsValid: pornstarNameIsValid,
    inputIsInvalid: pornstarNameIsInvalid,
    inputChangeHandler: pornstarNameChangeHandler,
    inputBlurHandler: pornstarNameBlurHandler,
    setInput: setPornstarName,
  } = useInput((input) => input.length >= 1);

  const { showSuccessfulPopup, setSuccessText, setTriggeredFrom } =
    useSuccessAlertContext();

  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  //flag to check
  const [imageUpdate, setImageUpdate] = useState<ImageUpdates>({
    didChange: false,
    didDelete: false,
  });

  const [pornstarTags, setPornstarTags] = useState<string[]>([]);

  const [pornstarLinks, setPornstarLinks] = useState<EditPornstarLinkObj[]>([]);

  const [deletedPornstarLinksIds, setDeletedPornstarLinksIds] = useState<
    number[]
  >([]);

  const [editedPornstarLinksIds, setEditedPornstarLinksIds] = useState<
    Set<number>
  >(new Set<number>());

  const [newPornstarLinksIdCounter, setNewPornstarLinksIdCounter] =
    useState<number>(-1);

  const [isDesktop, setDesktop] = useState(true);
  const [editPornstarLoading, setEditPornstarLoading] = useState(false);

  const [pornstarNameExists, setPornstarNameExists] = useState(false);
  const [genericError, setGenericError] = useState(false);
  const [versionError, setVersionError] = useState(false);
  const [rateLimitError, setRateLimitError] = useState(false);

  useEffect(() => {
    const updateMedia = () => {
      if (window.innerWidth > 650) {
        setDesktop(true);
      } else {
        setDesktop(false);
      }
    };
    updateMedia();
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  }, []);

  const addLinkHandler = () => {
    // the id 0 is just placeholder and can be used to tell these are recently added links
    const newInputList = [
      ...pornstarLinks,
      {
        pornstar_link_id: newPornstarLinksIdCounter,
        pornstar_link_title: "",
        pornstar_link_url: "",
      },
    ]; // Add an empty input
    setPornstarLinks(newInputList);
    setNewPornstarLinksIdCounter((prev) => prev - 1);
    console.log(pornstarLinks);
  };

  const titleInputChangeHandler = (
    e: ChangeEvent<HTMLInputElement>,
    pornstarLinkId: number
  ) => {
    // Make a copy of the current array
    const updatedLinks = [...pornstarLinks];

    // Find the index of the element you want to update
    const linkIndex = updatedLinks.findIndex(
      (link) => link.pornstar_link_id === pornstarLinkId
    );

    if (linkIndex !== -1) {
      // Create a new object with the updated title property
      // with objects in react we can't change the properties directly, we need to create a new object and replace old one
      const updatedLink = {
        ...updatedLinks[linkIndex],
        pornstar_link_title: e.target.value,
      };

      // Replace the old object with the new one in the copy of the array
      updatedLinks[linkIndex] = updatedLink;

      // Set the state with the updated copy of the array
      setPornstarLinks(updatedLinks);
    }
    const newSet = new Set(editedPornstarLinksIds);
    newSet.add(pornstarLinkId);
    setEditedPornstarLinksIds(newSet);
  };

  const urlInputChangeHandler = (
    e: ChangeEvent<HTMLInputElement>,
    pornstarLinkId: number
  ) => {
    // Make a copy of the current array
    const updatedLinks = [...pornstarLinks];

    // Find the index of the element you want to update
    const linkIndex = updatedLinks.findIndex(
      (link) => link.pornstar_link_id === pornstarLinkId
    );

    if (linkIndex !== -1) {
      // Create a new object with the updated title property
      // with objects in react we can't change the properties directly, we need to create a new object and replace old one
      const updatedLink = {
        ...updatedLinks[linkIndex],
        pornstar_link_url: e.target.value,
      };

      // Replace the old object with the new one in the copy of the array
      updatedLinks[linkIndex] = updatedLink;

      // Set the state with the updated copy of the array
      setPornstarLinks(updatedLinks);
    }
    const newSet = new Set(editedPornstarLinksIds);
    newSet.add(pornstarLinkId);
    setEditedPornstarLinksIds(newSet);
  };

  const handleDeleteLinkClick = async (linkId: number) => {
    if (linkId > 0)
      setDeletedPornstarLinksIds([...deletedPornstarLinksIds, linkId]);
    const updatedLinks = [...pornstarLinks];

    // Find the index of the element you want to remove
    const linkIndex = updatedLinks.findIndex(
      (link) => link.pornstar_link_id === linkId
    );

    if (linkIndex !== -1) {
      // Remove the element at linkIndex
      updatedLinks.splice(linkIndex, 1);

      // Set the state with the updated copy of the array (without the removed element)
      setPornstarLinks(updatedLinks);
    }
  };

  const [editPornstar, { loading: loadingEditPornstar }] =
    useMutation(EDIT_PORNSTAR, {
      errorPolicy: "all"
    });

  function stripTypenames(value: any): any {
    if (Array.isArray(value)) {
      return value.map(stripTypenames);
    } else if (value !== null && typeof value === "object") {
      const newObject: any = {};
      for (const property in value) {
        if (property !== "__typename") {
          newObject[property] = stripTypenames(value[property]);
        }
      }
      return newObject;
    } else {
      return value;
    }
  }

  const editPornstarHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!pornstarNameIsValid) {
      pornstarNameBlurHandler();
      return;
    }

    const editedPornstarLinksFiltered = pornstarLinks.filter(
      (link) =>
        editedPornstarLinksIds.has(link.pornstar_link_id) &&
        link.pornstar_link_id > 0
    );
    const updatedEditedPornstarLinks = stripTypenames(
      editedPornstarLinksFiltered
    );
    const newPornstarLinksFiltered = pornstarLinks.filter(
      (link) => link.pornstar_link_id < 0
    );

    try {
      setEditPornstarLoading(true);
      const result = await editPornstar({
        variables: {
          editPornstarInput: {
            pornstar_url_slug: params.id,
            pornstar_name: pornstarName.toLowerCase(),
            pornstar_picture: selectedImage !== null,
            pornstar_tags_text: pornstarTags,
            imageUpdate: imageUpdate,
            pornstar_links_updates: {
              edited_links: updatedEditedPornstarLinks,
              deleted_links_ids: deletedPornstarLinksIds,
              new_links: newPornstarLinksFiltered,
            },
          },
        },
      });

      if (!result) {
        setGenericError(true);
        setEditPornstarLoading(false);
        return;
      }

      if (result.errors && result.errors.length > 0) {
        const errorCode = result.errors[0].extensions?.code;

        switch (errorCode) {
          case "PORNSTAR_NAME_ALREADY_EXISTS":
            setPornstarNameExists(true);
            break;
          case "VERSION_ERROR":
            setVersionError(true);
            break;
          case "RATE_LIMIT_ERROR":
            setRateLimitError(true);
            break;
          default:
            setGenericError(true);
        }
        setEditPornstarLoading(false);
      } else if (result.data) {
        const secured_data = result.data.editPornstar.secured_data;

        if (secured_data) {
          try {
            const response = await fetch(
              process.env.NEXT_PUBLIC_CLOUDFLARE_UPLOAD_WORKER_URL || "",
              {
                method: "POST",
                headers: {
                  "Content-Type": selectedImage?.type || "",
                  "X-Secured-Data": secured_data,
                },
                body: selectedImage,
              }
            );
            if (!response.ok) {
              // If the response status is not 200, throw an error
              throw new Error(`Request failed with status ${response.status}`);
            }
            console.log("response", response);
            console.log(response.json);
            const responseBody = await response.text(); // Since `message` is a plain string
            console.log("Response Message:", responseBody);
          } catch (error) {
            console.error(error);
            setGenericError(true);
          }
        }

        // unfortunately trying to get the links data back from mutation doesn't work when there
        // is a link deleted, only add and edit links work for some reason
        // updates the view pornstar page
        await client.refetchQueries({
          include: ["GetPornstar"],
        });

        // updates dashboard
        client.cache.writeFragment({
          // keep in mind there are quotation marks here
          id: 'PornstarWithTags:{"pornstar_url_slug":"' + params.id + '"}',
          data: {
            __typename: "PornstarWithTags",
            pornstar_url_slug: params.id,
            pornstar_name: pornstarName.toLowerCase(),
            pornstar_picture_path:
              result.data.editPornstar.pornstar_picture_path,
            pornstar_tags_text: pornstarTags,
          },
          fragment: gql`
            fragment NewPornstar on PornstarWithTags {
              pornstar_url_slug
              pornstar_name
              pornstar_picture_path
              pornstar_tags_text
            }
          `,
        });

        setSuccessText("Changes saved");
        setTriggeredFrom("DASHBOARD");
        showSuccessfulPopup();
        // no need for this
        //setEditPornstarLoading(false);
        router.push("/dashboard");
        // we can checkout seeing if user was on dashboard 2 pages ago later
        //router.back();
        //router.back();
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      setEditPornstarLoading(false);
      setGenericError(true);
    }
  };

  if (loading) return <Loading />;
  if (error) {
    if (error.graphQLErrors && error.graphQLErrors.length > 0) {
      const errorCode = error.graphQLErrors[0].extensions.code;
      switch (errorCode) {
        // scenario if user deleted the pornstar and clicked on the old pornstar link in web browser
        // or if user refreshes the page after error from save button maybe because pornstar is deleted
        case "PORNSTAR_NOT_FOUND":
          router.push("/dashboard");
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

  return (
    <div className={styles["component-container"]}>
      <form
        className={styles["flex-form-container"]}
        onSubmit={editPornstarHandler}
      >
        <h2 className={styles["header"]}>Edit Pornstar</h2>
        <div className={styles["second-row"]}>
          {isDesktop && (
            <UploadImage
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
              pornstar_picture_path={data.getPornstar.pornstar_picture_path}
              setImageUpdate={setImageUpdate}
              imageUpdate={imageUpdate}
            />
          )}
          <div className={styles["flex-child-right-side"]}>
            <PornstarName
              pornstarName={pornstarName}
              pornstarNameIsInvalid={pornstarNameIsInvalid}
              pornstarNameChangeHandler={pornstarNameChangeHandler}
              pornstarNameBlurHandler={pornstarNameBlurHandler}
              pornstarNameExists={pornstarNameExists}
            />
            {!isDesktop && (
              <MobileUploadImage
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
                pornstar_picture_path={data.getPornstar.pornstar_picture_path}
                setImageUpdate={setImageUpdate}
                imageUpdate={imageUpdate}
              />
            )}
            <Tags
              pornstarTags={pornstarTags}
              setPornstarTags={setPornstarTags}
            />
            <div className={styles["links-header-button-container"]}>
              <div className={styles["links-header"]}>Links</div>
              <button
                type="button"
                onClick={addLinkHandler}
                className={styles["add-link-button"]}
              >
                Add Video Link
              </button>
            </div>
            <ul className={styles["pornstar-links-list"]}>
              {pornstarLinks.map((link: any) => (
                <li className={styles["pornstar-links-list-item"]}>
                  <div
                    className={styles["x-button"]}
                    onClick={() => handleDeleteLinkClick(link.pornstar_link_id)}
                  >
                    &times;
                  </div>
                  <label className={styles["title-label"]}>Title</label>
                  <input
                    type="text"
                    placeholder="Title/Studio/Notes (Optional)"
                    value={link.pornstar_link_title}
                    onChange={(e) =>
                      titleInputChangeHandler(e, link.pornstar_link_id)
                    }
                  />
                  <label className={styles["url-label"]}>URL</label>
                  <input
                    type="text"
                    value={link.pornstar_link_url}
                    placeholder="Video Link (Optional)"
                    onChange={(e) =>
                      urlInputChangeHandler(e, link.pornstar_link_id)
                    }
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className={styles["buttons-and-error-message-container"]}>
          <div className={styles["buttons-container"]}>
            <Link
              href={"/pornstar/" + params.id}
              className={`${styles["cancel-button"]}`}
              prefetch={false}
            >
              Cancel
            </Link>
            <button
              type="submit"
              className={`${styles["add-pornstar-button"]}`}
              disabled={editPornstarLoading}
            >
              {editPornstarLoading ? (
                <RotatingLines
                  visible={true}
                  width="25"
                  strokeWidth="5"
                  strokeColor="white"
                  animationDuration="0.75"
                  ariaLabel="rotating-lines-loading"
                />
              ) : (
                "Save"
              )}
            </button>
          </div>
          <GenericError genericError={genericError} />
          <MutationVersionError versionError={versionError} />
          <RateLimitError rateLimitError={rateLimitError} />
        </div>
      </form>
    </div>
  );
}
