import React, { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { GET_ACTOR } from "@/queries/actorQueries";
import { useMutation, useQuery } from "@apollo/client";
import styles from "./EditActorBody.module.scss";
import useInput from "../hooks/useInput";
import { useApolloClient } from "@apollo/client";
import { EDIT_ACTOR } from "@/mutations/actorMutations";
import { gql } from "@apollo/client";
import UploadImage from "../actorInputComponents/UploadImage";
import Tags from "../actorInputComponents/Tags";
import ActorName from "../actorInputComponents/ActorName";
import Link from "next/link";
import MobileUploadImage from "../actorInputComponents/MobileUploadImage";
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

export interface ActorAndTagsReturn {
  getActor: {
    actor: any;
    tags: any;
  };
}

export interface EditActorLinkObj {
  actor_link_id: number;
  actor_link_title: string;
  actor_link_url: string;
}

export default function EditActorBody() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  function capitalizeWords(str: string) {
    return str
      .split(" ") // Split the string into an array of words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
      .join(" "); // Join the array back into a string
  }

  const { loading, error, data } = useQuery(GET_ACTOR, {
    variables: {
      getActorInput: {
        actor_url_slug: params.id,
      },
    },
    errorPolicy: "all",
    onCompleted: (data) => {
      document.title =
        "Edit - " +
        capitalizeWords(data.getActor.actor_name) +
        " - MyFapSheet";
      setActorTags(
        data.getActor.actor_tags.map((tag: any) => tag.actor_tag_text)
      );
      setactorName(data.getActor.actor_name);
      setActorLinks(data.getActor.actor_links);
    },
  });

  const client = useApolloClient();

  const {
    input: actorName,
    inputIsValid: actorNameIsValid,
    inputIsInvalid: actorNameIsInvalid,
    inputChangeHandler: actorNameChangeHandler,
    inputBlurHandler: actorNameBlurHandler,
    setInput: setactorName,
  } = useInput((input) => input.length >= 1);

  const { showSuccessfulPopup, setSuccessText, setTriggeredFrom } =
    useSuccessAlertContext();

  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  //flag to check
  const [imageUpdate, setImageUpdate] = useState<ImageUpdates>({
    didChange: false,
    didDelete: false,
  });

  const [actorTags, setActorTags] = useState<string[]>([]);

  const [actorLinks, setActorLinks] = useState<EditActorLinkObj[]>([]);

  const [deletedActorLinksIds, setDeletedActorLinksIds] = useState<
    number[]
  >([]);

  const [editedActorLinksIds, setEditedActorLinksIds] = useState<
    Set<number>
  >(new Set<number>());

  const [newActorLinksIdCounter, setNewActorLinksIdCounter] =
    useState<number>(-1);

  const [isDesktop, setDesktop] = useState(true);
  const [editActorLoading, setEditActorLoading] = useState(false);

  const [actorNameExists, setActorNameExists] = useState(false);
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
      ...actorLinks,
      {
        actor_link_id: newActorLinksIdCounter,
        actor_link_title: "",
        actor_link_url: "",
      },
    ]; // Add an empty input
    setActorLinks(newInputList);
    setNewActorLinksIdCounter((prev) => prev - 1);
    console.log(actorLinks);
  };

  const titleInputChangeHandler = (
    e: ChangeEvent<HTMLInputElement>,
    actorLinkId: number
  ) => {
    // Make a copy of the current array
    const updatedLinks = [...actorLinks];

    // Find the index of the element you want to update
    const linkIndex = updatedLinks.findIndex(
      (link) => link.actor_link_id === actorLinkId
    );

    if (linkIndex !== -1) {
      // Create a new object with the updated title property
      // with objects in react we can't change the properties directly, we need to create a new object and replace old one
      const updatedLink = {
        ...updatedLinks[linkIndex],
        actor_link_title: e.target.value,
      };

      // Replace the old object with the new one in the copy of the array
      updatedLinks[linkIndex] = updatedLink;

      // Set the state with the updated copy of the array
      setActorLinks(updatedLinks);
    }
    const newSet = new Set(editedActorLinksIds);
    newSet.add(actorLinkId);
    setEditedActorLinksIds(newSet);
  };

  const urlInputChangeHandler = (
    e: ChangeEvent<HTMLInputElement>,
    actorLinkId: number
  ) => {
    // Make a copy of the current array
    const updatedLinks = [...actorLinks];

    // Find the index of the element you want to update
    const linkIndex = updatedLinks.findIndex(
      (link) => link.actor_link_id === actorLinkId
    );

    if (linkIndex !== -1) {
      // Create a new object with the updated title property
      // with objects in react we can't change the properties directly, we need to create a new object and replace old one
      const updatedLink = {
        ...updatedLinks[linkIndex],
        actor_link_url: e.target.value,
      };

      // Replace the old object with the new one in the copy of the array
      updatedLinks[linkIndex] = updatedLink;

      // Set the state with the updated copy of the array
      setActorLinks(updatedLinks);
    }
    const newSet = new Set(editedActorLinksIds);
    newSet.add(actorLinkId);
    setEditedActorLinksIds(newSet);
  };

  const handleDeleteLinkClick = async (linkId: number) => {
    if (linkId > 0)
      setDeletedActorLinksIds([...deletedActorLinksIds, linkId]);
    const updatedLinks = [...actorLinks];

    // Find the index of the element you want to remove
    const linkIndex = updatedLinks.findIndex(
      (link) => link.actor_link_id === linkId
    );

    if (linkIndex !== -1) {
      // Remove the element at linkIndex
      updatedLinks.splice(linkIndex, 1);

      // Set the state with the updated copy of the array (without the removed element)
      setActorLinks(updatedLinks);
    }
  };

  const [editActor, { loading: loadingEditActor }] =
    useMutation(EDIT_ACTOR, {
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

  const editactorHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!actorNameIsValid) {
      actorNameBlurHandler();
      return;
    }

    const editedActorLinksFiltered = actorLinks.filter(
      (link) =>
        editedActorLinksIds.has(link.actor_link_id) &&
        link.actor_link_id > 0
    );
    const updatedEditedActorLinks = stripTypenames(
      editedActorLinksFiltered
    );
    const newActorLinksFiltered = actorLinks.filter(
      (link) => link.actor_link_id < 0
    );

    try {
      setEditActorLoading(true);
      const result = await editActor({
        variables: {
          editActorInput: {
            actor_url_slug: params.id,
            actor_name: actorName.toLowerCase(),
            actor_picture: selectedImage !== null,
            actor_tags_text: actorTags,
            imageUpdate: imageUpdate,
            actor_links_updates: {
              edited_links: updatedEditedActorLinks,
              deleted_links_ids: deletedActorLinksIds,
              new_links: newActorLinksFiltered,
            },
          },
        },
      });

      if (!result) {
        setGenericError(true);
        setEditActorLoading(false);
        return;
      }

      if (result.errors && result.errors.length > 0) {
        const errorCode = result.errors[0].extensions?.code;

        switch (errorCode) {
          case "ACTOR_NAME_ALREADY_EXISTS":
            setActorNameExists(true);
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
        setEditActorLoading(false);
      } else if (result.data) {
        const secured_data = result.data.editActor.secured_data;

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
        // updates the view actor page
        await client.refetchQueries({
          include: ["GetActor"],
        });

        // updates dashboard
        client.cache.writeFragment({
          // keep in mind there are quotation marks here
          id: 'ActorWithTags:{"actor_url_slug":"' + params.id + '"}',
          data: {
            __typename: "ActorWithTags",
            actor_url_slug: params.id,
            actor_name: actorName.toLowerCase(),
            actor_picture_path:
              result.data.editActor.actor_picture_path,
            actor_tags_text: actorTags,
          },
          fragment: gql`
            fragment Newactor on ActorWithTags {
              actor_url_slug
              actor_name
              actor_picture_path
              actor_tags_text
            }
          `,
        });

        setSuccessText("Changes saved");
        setTriggeredFrom("DASHBOARD");
        showSuccessfulPopup();
        // no need for this
        //setEditactorLoading(false);
        router.push("/dashboard");
        // we can checkout seeing if user was on dashboard 2 pages ago later
        //router.back();
        //router.back();
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      setEditActorLoading(false);
      setGenericError(true);
    }
  };

  if (loading) return <Loading />;
  if (error) {
    if (error.graphQLErrors && error.graphQLErrors.length > 0) {
      const errorCode = error.graphQLErrors[0].extensions.code;
      switch (errorCode) {
        // scenario if user deleted the actor and clicked on the old actor link in web browser
        // or if user refreshes the page after error from save button maybe because actor is deleted
        case "ACTOR_NOT_FOUND":
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
              Error loading actor data. Please refresh the page and try
              again.
              <br></br>
              If error persists please contact support@myfapsheet.com for help
            </ErrorMessage>
          );
      }
    }
    return (
      <ErrorMessage>
        Error loading actor data. Please refresh the page and try again.
        <br></br>
        If error persists please contact support@myfapsheet.com for help
      </ErrorMessage>
    );
  }

  return (
    <div className={styles["component-container"]}>
      <form
        className={styles["flex-form-container"]}
        onSubmit={editactorHandler}
      >
        <h2 className={styles["header"]}>Edit Character</h2>
        <div className={styles["second-row"]}>
          {isDesktop && (
            <UploadImage
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
              actor_picture_path={data.getActor.actor_picture_path}
              setImageUpdate={setImageUpdate}
              imageUpdate={imageUpdate}
            />
          )}
          <div className={styles["flex-child-right-side"]}>
            <ActorName
              actorName={actorName}
              actorNameIsInvalid={actorNameIsInvalid}
              actorNameChangeHandler={actorNameChangeHandler}
              actorNameBlurHandler={actorNameBlurHandler}
              actorNameExists={actorNameExists}
            />
            {!isDesktop && (
              <MobileUploadImage
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
                actor_picture_path={data.getActor.actor_picture_path}
                setImageUpdate={setImageUpdate}
                imageUpdate={imageUpdate}
              />
            )}
            <Tags
              actorTags={actorTags}
              setactorTags={setActorTags}
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
            <ul className={styles["actor-links-list"]}>
              {actorLinks.map((link: any) => (
                <li className={styles["actor-links-list-item"]}>
                  <div
                    className={styles["x-button"]}
                    onClick={() => handleDeleteLinkClick(link.actor_link_id)}
                  >
                    &times;
                  </div>
                  <label className={styles["title-label"]}>Title</label>
                  <input
                    type="text"
                    placeholder="Title/Studio/Notes (Optional)"
                    value={link.actor_link_title}
                    onChange={(e) =>
                      titleInputChangeHandler(e, link.actor_link_id)
                    }
                  />
                  <label className={styles["url-label"]}>URL</label>
                  <input
                    type="text"
                    value={link.actor_link_url}
                    placeholder="Video Link (Optional)"
                    onChange={(e) =>
                      urlInputChangeHandler(e, link.actor_link_id)
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
              href={"/actor/" + params.id}
              className={`${styles["cancel-button"]}`}
              prefetch={false}
            >
              Cancel
            </Link>
            <button
              type="submit"
              className={`${styles["add-actor-button"]}`}
              disabled={editActorLoading}
            >
              {editActorLoading ? (
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
