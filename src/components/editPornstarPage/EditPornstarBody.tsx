import React, { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { GET_PORNSTAR } from "@/queries/pornstars";
import { useMutation, useQuery } from "@apollo/client";
import styles from "./EditPornstarBody.module.scss";
import useInput from "../hooks/useInput";
import { useApolloClient } from "@apollo/client";
import { EDIT_PORNSTAR, DELETE_PORNSTAR } from "@/mutations/pornstarMutations";
import { gql } from "@apollo/client";
import UploadImage from "../pornstarInputComponents/UploadImage";
import Tags from "../pornstarInputComponents/Tags";
import PornstarName from "../pornstarInputComponents/PornstarName";
import Image from "next/image";
import Link from "next/link";
import MobileUploadImage from "../pornstarInputComponents/MobileUploadImage";
import { RotatingLines } from "react-loader-spinner";

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

export interface PornstarTag {
  tag_text: string;
  user_tag: {
    user_tag_id: number;
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
  //const pornstarId = typeof router.query.id === "string" ? parseInt(router.query.id) : -1;
  const pornstarId = typeof params.id === "string" ? parseInt(params.id) : "-1";
  const { loading, error, data } = useQuery(GET_PORNSTAR, {
    variables: {
      getPornstarInput: {
        pornstar_id: pornstarId,
      },
    },
    errorPolicy: "all",
    onCompleted: (data) => {
      //setPornstarTags(data.getPornstar.pornstar_tags.map((tag: any) => tag.tag_text));
      setPornstarTags(
        data.getPornstar.pornstar_tags.map((tag: any) => ({
          tag_text: tag.tag_text,
          user_tag: {
            user_tag_id: tag.user_tag.user_tag_id,
          },
        }))
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

  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  //flag to check
  const [imageUpdate, setImageUpdate] = useState<ImageUpdates>({
    didChange: false,
    didDelete: false,
  });

  const [pornstarTags, setPornstarTags] = useState<PornstarTag[]>([]);

  const [pornstarLinks, setPornstarLinks] = useState<EditPornstarLinkObj[]>([]);

  const [deletedPornstarLinksIds, setDeletedPornstarLinksIds] = useState<
    number[]
  >([]);

  const [editedPornstarLinksIds, setEditedPornstarLinksIds] = useState<
    Set<number>
  >(new Set<number>());

  const [newPornstarLinksIdCounter, setNewPornstarLinksIdCounter] =
    useState<number>(-1);

  const [isDesktop, setDesktop] = useState(false);

  const [genericError, setGenericError] = useState(false);

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

  const handleDeleteTagClick = async (linkId: number) => {
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
  /*
  const [editPornstar] = useMutation(EDIT_PORNSTAR, {
    variables: {
      editPornstarInput: {
        pornstar_id: pornstarId,
        pornstar_name: pornstarName,
        pornstar_picture: selectedImage !== null,
        pornstar_tags: pornstarTags,
        imageUpdate: imageUpdate,
        pornstar_links_updates: {
          edited_links: editedPornstarLinks,
          deleted_links_ids: deletedPornstarLinksIds,
          new_links: newPornstarLinks
        }
      },
    },
    errorPolicy: 'all',
  });
  */
  const [editPornstar, { loading: loadingEditPornstar }] = useMutation(
    EDIT_PORNSTAR,
    {
      errorPolicy: "all",
    }
  );

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
      const result = await editPornstar({
        variables: {
          editPornstarInput: {
            pornstar_id: pornstarId,
            pornstar_name: pornstarName,
            pornstar_picture: selectedImage !== null,
            pornstar_tags_obj: pornstarTags,
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
        return;
      }

      if (result.errors && result.errors.length > 0) {
        console.log("there was errors");
        console.log(result);
        console.log(result.errors[0].extensions.code);
        setGenericError(true);
        return;
        // obviously put these code in a constant maybe in a file somewhere
      } else if (result.data) {
        console.log(result.data);
        console.log("it worked");
        //router.push("/dashboard")

        console.log(result.data);
        const url = result.data.editPornstar.s3Url;

        console.log(selectedImage);
        console.log(pornstarTags);
        console.log("data", url);
        console.log(selectedImage?.type);

        // If there is an error withh this we need to quickly call back to our graphql server
        // maybe go in edit function and delete the url or something in our database entry

        if (url)
          {
            try {
              await fetch(url, {
                method: "PUT",
                headers: {
                  "Content-Type": selectedImage?.type || "",
                },
                body: selectedImage,
              });
            } catch (error) {
              console.error(error)
              setGenericError(true);
            }
          }

        //const imageUrl = url.split("?")[0];

        //unfortunately trying to get the links data back from mutation doesn't work when there
        // is a link deleted, only add and edit links work for some reason
        await client.refetchQueries({
          include: ["GetPornstar"],
        });

        const newPornstarRef = client.cache.writeFragment({
          id:
            'PornstarWithTags:{"pornstar_id":' +
            result.data.editPornstar.pornstar_id +
            "}",
          data: {
            __typename: "PornstarWithTags",
            pornstar_id: result.data.editPornstar.pornstar_id,
            pornstar_name: pornstarName,
            pornstar_picture_path:
              result.data.editPornstar.pornstar_picture_path,
            pornstar_tags_text: pornstarTags.map(
              (tagObj: any) => tagObj.tag_text
            ),
          },
          fragment: gql`
            fragment NewPornstar on PornstarWithTags {
              pornstar_id
              pornstar_name
              pornstar_picture_path
              pornstar_tags_text
            }
          `,
        });

        console.log("alohaaaaa", newPornstarRef);

        router.push("/dashboard");
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      setGenericError(true);
    }
  };

  // next level idea for the tags, like in gmail show a preview for a tag as a user types and have them press tab to finish the word.
  // naw might be too high level for my users, i don't think they even know to press tab lol
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error! {error.message}</div>;

  //if (loading2) return 'Submitting...';
  //if (error2) return `Submission error! ${error2.message}`;
  //consider if we should test for name uniqueness if its worth it
  // i might just put the name in separate component just for sake of congruence with the other 2
  console.log("hiii");
  console.log(deletedPornstarLinksIds);
  console.log(pornstarLinks);
  //const tagsText = data.getPornstar.tags.map((tag: any) => tag.tag_text);
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
                    onClick={() => handleDeleteTagClick(link.pornstar_link_id)}
                  >
                    &times;
                  </div>
                  <label className={styles["title-label"]}>Title</label>
                  <input
                    type="text"
                    placeholder="Title/Studio/Notes"
                    value={link.pornstar_link_title}
                    onChange={(e) =>
                      titleInputChangeHandler(e, link.pornstar_link_id)
                    }
                  />
                  <label className={styles["url-label"]}>URL</label>
                  <input
                    type="text"
                    value={link.pornstar_link_url}
                    placeholder="Video Link"
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
          {genericError && (
            <span className={styles["server-error-message"]}>
              Server Error. Please Refresh Page or try again later.
            </span>
          )}
          <div className={styles["buttons-container"]}>
            <Link
              href={"/pornstar/" + pornstarId}
              className={`${styles["cancel-button"]}`}
            >
              Cancel
            </Link>
            <button
              type="submit"
              className={`${styles["add-pornstar-button"]}`}
            >
              {loadingEditPornstar ? (
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
        </div>
      </form>
    </div>
  );
}

/*
    <div>EditPornstarBody{router.query.id}
    <span>{data.getPornstar.pornstar.pornstar_name}</span>
    {data.getPornstar.tags.map((tag : any) => (
      <div>{tag.tag_text}</div>
    ))}
    </div>
    */
