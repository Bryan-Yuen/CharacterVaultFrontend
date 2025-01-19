import React, { FormEvent, useState, useEffect } from "react";
import styles from "./DeletePornstarModal.module.scss";
import { DELETE_PORNSTAR } from "@/mutations/pornstarMutations";
import { useMutation } from "@apollo/client";
import { useApolloClient } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useSuccessAlertContext } from "@/contexts/ShowSuccessAlertContext";
import { RotatingLines } from "react-loader-spinner";

interface propDefs {
  pornstar_url_slug: string;
  pornstar_name: string;
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DeletePornstarModal(props: propDefs) {
  const client = useApolloClient();
  const router = useRouter();

  const { showSuccessfulPopup, setSuccessText, setTriggeredFrom } =
    useSuccessAlertContext();

  const [deletePornstarLoading, setDeletePornstarLoading] = useState(false);
  const [genericError, setGenericError] = useState(false);

  const [deletePornstar] = useMutation(DELETE_PORNSTAR, {
    variables: {
      deletePornstarInput: {
        pornstar_url_slug: props.pornstar_url_slug,
      },
    },
    errorPolicy: "all",
  });

  const deletePornstarHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setDeletePornstarLoading(true);
      const result = await deletePornstar();

      if (!result) {
        setGenericError(true);
        setDeletePornstarLoading(false);
        return;
      }
      if (result.errors && result.errors.length > 0) {
        setDeletePornstarLoading(false);
        setGenericError(true);
      } else if (result.data) {
        const normalizedId = client.cache.identify({
          pornstar_url_slug: props.pornstar_url_slug,
          __typename: "PornstarWithTags",
        });
        client.cache.evict({ id: normalizedId });
        client.cache.gc();

        props.setModalIsOpen(false);
        setSuccessText("Pornstar Deleted");
        setTriggeredFrom("DASHBOARD");
        showSuccessfulPopup();
        //router.push("/dashboard");
        //router.back();
        const referrer = document.referrer;

        // unfortunately can't use this because user could clicked edit pornstar and then back to view
        // and the it will bounce back to edit pornstar
        /*
        // If the referrer contains "/dashboard" or is the same domain
        if (
          referrer.includes(window.location.hostname) &&
          referrer.includes("/dashboard")
        ) {
          router.back(); // Go back to the previous page
        } else {
          router.push("/dashboard"); // Redirect to the dashboard
        }
          */
        // no need for this
        //setDeletePornstarLoading(false);
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      setDeletePornstarLoading(false);
      setGenericError(true);
    }
  };

  return (
    <div
      className={styles["backdrop"]}
      onClick={() => props.setModalIsOpen(false)}
    >
      <div className={styles["modal"]} onClick={(e) => e.stopPropagation()}>
        <div className={styles["modal-header"]}>
          <div className={styles["modal-title"]}>Confirm Delete</div>
          <button
            onClick={() => props.setModalIsOpen(false)}
            className={styles["close"]}
          >
            &#10006;
          </button>
        </div>
        <form
          onSubmit={deletePornstarHandler}
          className={styles["form-container"]}
        >
          <span>{props.pornstar_name} and all its data will be removed.</span>
          <div className={styles["sign-up-button-container"]}>
            <button
              className={styles["sign-up-button"]}
              type="submit"
              disabled={deletePornstarLoading}
            >
              {deletePornstarLoading ? (
                <RotatingLines
                  visible={true}
                  width="25"
                  strokeWidth="5"
                  strokeColor="white"
                  animationDuration="0.75"
                  ariaLabel="rotating-lines-loading"
                />
              ) : (
                "Delete"
              )}
            </button>
          </div>
        </form>
        {genericError && (
          <span className={styles["server-error-message"]}>
            Server Error. Please Refresh Page or try again later.
          </span>
        )}
      </div>
    </div>
  );
}
