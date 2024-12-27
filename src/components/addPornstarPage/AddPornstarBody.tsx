import React, { useState, FormEvent, useEffect } from "react";
import styles from "./AddPornstarBody.module.scss";
import { useRouter } from "next/navigation";
import useInput from "../hooks/useInput";
import UploadImage from "../pornstarInputComponents/UploadImage";
import PornstarName from "../pornstarInputComponents/PornstarName";
import Tags from "../pornstarInputComponents/Tags";
import { gql } from "@apollo/client";
import { useApolloClient } from "@apollo/client";
import { useMutation } from "@apollo/client";
import { ADD_PORNSTAR } from "@/mutations/pornstarMutations";
import PornstarLinks from "../pornstarInputComponents/PornstarLinks";
import MobileUploadImage from "../pornstarInputComponents/MobileUploadImage";
import Link from "next/link";
import { RotatingLines } from "react-loader-spinner";
import GenericError from "../utilities/GenericError";
import MutationVersionError from "../utilities/MutationVersionError";
import RateLimitError from "../utilities/RateLimitError";
import "dotenv/config";
import { useSuccessAlertContext } from '@/contexts/ShowSuccessAlertContext';

if (!process.env.NEXT_PUBLIC_PORNSTAR_PICTURES_BUCKET_URL) {
  throw new Error("no pornstar picture bucket url");
}

if (!process.env.NEXT_PUBLIC_CLOUDFLARE_UPLOAD_WORKER_URL) {
  throw new Error("no cloudflare upload worker url");
}

export interface PornstarLinkObj {
  pornstar_link_title: string;
  pornstar_link_url: string;
}

export default function AddPornstarBody() {
  const {
    input: pornstarName,
    inputIsValid: pornstarNameIsValid,
    inputIsInvalid: pornstarNameIsInvalid,
    inputChangeHandler: pornstarNameChangeHandler,
    inputBlurHandler: pornstarNameBlurHandler,
  } = useInput((input) => input.length >= 1);

  const router = useRouter();
  const client = useApolloClient();

  const {showSuccessfulPopup , setSuccessText} = useSuccessAlertContext();

  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const [pornstarTags, setPornstarTags] = useState<string[]>([]);

  const [pornstarLinks, setPornstarLinks] = useState<PornstarLinkObj[]>([]);

  const [isDesktop, setDesktop] = useState(false);

  // lets maybe change this name to fail to add ponstar error instead of generic
  const [pornstarNameExists, setPornstarNameExists] = useState(false)
  const [genericError, setGenericError] = useState(false);
  const [versionError, setVersionError] = useState(false);
  const [rateLimitError, setRateLimitError] = useState(false);

  useEffect(() => {
    const updateMedia = () => {
      if (window.innerWidth > 800) {
        setDesktop(true);
      } else {
        setDesktop(false);
      }
    };

    updateMedia();

    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  }, []);

  const [addPornstar, { loading }] = useMutation(ADD_PORNSTAR, {
    variables: {
      addPornstarInput: {
        pornstar_name: pornstarName,
        pornstar_picture: selectedImage !== null,
        pornstar_tags_text: pornstarTags,
        pornstar_links_title_url: pornstarLinks,
      },
    },
    errorPolicy: "all"
  });

  const addPornstarHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!pornstarNameIsValid) {
      pornstarNameBlurHandler();
      return;
    }

    try {
      const result = await addPornstar();
      if (!result) {
        setGenericError(true);
        return;
      }
      if (result.errors && result.errors.length > 0) {
        const errorCode = result.errors[0].extensions.code;

        switch (errorCode) {
          case "PORNSTAR_NAME_ALREADY_EXISTS":
            setPornstarNameExists(true);
            break;
          case "VERSION_ERROR":
            setVersionError(true);
            break;
          case "RATE_LIMIT_ERROR":
            setRateLimitError(true)
            break;
          default:
            setGenericError(true);
        }
      } else if (result.data) {
        const secured_data = result.data.addPornstar.secured_data;

        if (secured_data) {
          try {
            const response = await fetch(process.env.NEXT_PUBLIC_CLOUDFLARE_UPLOAD_WORKER_URL || "", {
              method: "POST",
              headers: {
                "Content-Type": selectedImage?.type || "",
                "X-Secured-Data": secured_data,
              },
              body: selectedImage,
            });
            if (!response.ok) {
              // If the response status is not 200, throw an error
              throw new Error(`Request failed with status ${response.status}`);
            }
            console.log("response",response)
            console.log(response.json)
            const responseBody = await response.text(); // Since `message` is a plain string
            console.log("Response Message:", responseBody);
          } catch (error) {
            console.error(error);
            setGenericError(true);
          }
        }

        client.cache.modify({
          fields: {
            getAllPornstarsAndTags(existingPornstars = []) {
              const newPornstarRef = client.cache.writeFragment({
                data: {
                  __typename: "PornstarWithTags",
                  pornstar_url_slug: result.data.addPornstar.pornstar_url_slug,
                  pornstar_name: pornstarName,
                  pornstar_picture_path: selectedImage ? result.data.addPornstar.pornstar_picture_path : null,
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
              return [...existingPornstars, newPornstarRef];
            },
          },
        });

        setSuccessText("Pornstar added")
        showSuccessfulPopup();
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      setGenericError(true);
    }
  };

  return (
    <div className={styles["component-container"]}>
      <form
        className={styles["flex-form-container"]}
        onSubmit={addPornstarHandler}
      >
        <h2 className={styles["header"]}>Add Pornstar</h2>
        <div className={styles["second-row"]}>
          {isDesktop && (
            <UploadImage
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
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
              />
            )}
            <Tags
              pornstarTags={pornstarTags}
              setPornstarTags={setPornstarTags}
            />
            <PornstarLinks
              pornstarLinks={pornstarLinks}
              setPornstarLinks={setPornstarLinks}
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
              className={`${styles["add-pornstar-button"]}`}
            >
              {loading ? (
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
