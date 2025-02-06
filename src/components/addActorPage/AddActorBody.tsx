import React, { useState, FormEvent, useEffect } from "react";
import styles from "./AddActorBody.module.scss";
import { useRouter } from "next/navigation";
import useInput from "../hooks/useInput";
import UploadImage from "../actorInputComponents/UploadImage";
import ActorName from "../actorInputComponents/ActorName";
import Tags from "../actorInputComponents/Tags";
import { gql } from "@apollo/client";
import { useApolloClient } from "@apollo/client";
import { useMutation } from "@apollo/client";
import { ADD_ACTOR } from "@/mutations/actorMutations";
import ActorLinks from "../actorInputComponents/ActorLinks";
import MobileUploadImage from "../actorInputComponents/MobileUploadImage";
import Link from "next/link";
import { RotatingLines } from "react-loader-spinner";
import GenericError from "../utilities/GenericError";
import MutationVersionError from "../utilities/MutationVersionError";
import RateLimitError from "../utilities/RateLimitError";
import "dotenv/config";
import { useSuccessAlertContext } from "@/contexts/ShowSuccessAlertContext";

if (!process.env.NEXT_PUBLIC_ACTOR_PICTURES_BUCKET_URL) {
  throw new Error("no actor picture bucket url");
}

if (!process.env.NEXT_PUBLIC_CLOUDFLARE_UPLOAD_WORKER_URL) {
  throw new Error("no cloudflare upload worker url");
}

export interface ActorLinkObj {
  actor_link_title: string;
  actor_link_url: string;
}

export default function AddActorBody() {
  const {
    input: actorName,
    inputIsValid: actorNameIsValid,
    inputIsInvalid: actorNameIsInvalid,
    inputChangeHandler: actorNameChangeHandler,
    inputBlurHandler: actorNameBlurHandler,
  } = useInput((input) => input.length >= 1);

  const router = useRouter();
  const client = useApolloClient();

  const { showSuccessfulPopup, setSuccessText, setTriggeredFrom } = useSuccessAlertContext();

  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const [actorTags, setactorTags] = useState<string[]>([]);

  const [actorLinks, setactorLinks] = useState<ActorLinkObj[]>([]);

  const [isDesktop, setDesktop] = useState(true);
  const [addActorLoading, setAddActorLoading] = useState(false);

  // lets maybe change this name to fail to add ponstar error instead of generic
  const [actorNameExists, setactorNameExists] = useState(false);
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

  const [addactor, { loading }] = useMutation(ADD_ACTOR, {
    variables: {
      addActorInput: {
        actor_name: actorName.toLowerCase(),
        actor_picture: selectedImage !== null,
        actor_tags_text: actorTags,
        actor_links_title_url: actorLinks,
      },
    },
    errorPolicy: "all",
  });

  const addactorHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!actorNameIsValid) {
      actorNameBlurHandler();
      return;
    }

    try {
      setAddActorLoading(true);
      const result = await addactor();
      if (!result) {
        setGenericError(true);
        setAddActorLoading(false);
        return;
      }
      if (result.errors && result.errors.length > 0) {
        const errorCode = result.errors[0].extensions.code;

        switch (errorCode) {
          case "ACTOR_NAME_ALREADY_EXISTS":
            setactorNameExists(true);
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
        setAddActorLoading(false);
      } else if (result.data) {
        const secured_data = result.data.addActor.secured_data;

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
              const errorMessage = await response.text(); // Read the response body as text
              console.error(`Error from server: ${errorMessage}`);
              throw new Error(errorMessage); // Optional: Re-throw the error
            }
            console.log("response", response);
            console.log(response.json);
            const responseBody = await response.text(); // Since `message` is a plain string
            console.log("Response Message:", responseBody);
          } catch (error: any) {
            console.error(error);
            console.log("error message", error.message);
            setGenericError(true);
          }
        }

        client.cache.modify({
          fields: {
            getAllActorsAndTags(existingActors = []) {
              const newActorRef = client.cache.writeFragment({
                data: {
                  __typename: "ActorWithTags",
                  actor_url_slug: result.data.addActor.actor_url_slug,
                  actor_name: actorName.toLowerCase(),
                  actor_picture_path: selectedImage
                    ? result.data.addActor.actor_picture_path
                    : null,
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
              return [...existingActors, newActorRef];
            },
          },
        });

        setSuccessText("Character Added");
        setTriggeredFrom("DASHBOARD")
        showSuccessfulPopup();
        // no need for this
        //setAddactorLoading(false)
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      setAddActorLoading(false)
      setGenericError(true);
    }
  };

  return (
    <div className={styles["component-container"]}>
      <form
        className={styles["flex-form-container"]}
        onSubmit={addactorHandler}
      >
        <h2 className={styles["header"]}>Add Actor</h2>
        <div className={styles["second-row"]}>
          {isDesktop && (
            <UploadImage
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
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
              />
            )}
            <Tags
              actorTags={actorTags}
              setactorTags={setactorTags}
            />
            <ActorLinks
              actorLinks={actorLinks}
              setactorLinks={setactorLinks}
            />
          </div>
        </div>
        <div className={styles["buttons-and-error-message-container"]}>
          <div className={styles["buttons-container"]}>
            <Link href={"/dashboard"} className={`${styles["cancel-button"]}`}>
              Cancel
            </Link>
            <button
              type="submit"
              className={`${styles["add-actor-button"]}`}
              disabled={addActorLoading}
            >
              {addActorLoading ? (
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
