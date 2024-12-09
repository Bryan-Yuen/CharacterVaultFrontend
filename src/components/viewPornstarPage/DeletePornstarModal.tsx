import React, { FormEvent, useState, useEffect } from "react";
import styles from "./DeletePornstarModal.module.scss";
import { DELETE_PORNSTAR } from "@/mutations/pornstarMutations";
import { useMutation } from "@apollo/client";
import { useApolloClient } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useSuccessAlertContext } from "@/contexts/ShowSuccessAlertContext";

interface propDefs {
  pornstar_url_slug: string;
  pornstar_name: string;
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DeletePornstarModal(props: propDefs) {
  const client = useApolloClient();
  const router = useRouter();

  const { showSuccessfulPopup, setSuccessText } = useSuccessAlertContext();

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
      const result = await deletePornstar();

      if (!result) {
        setGenericError(true);
        return;
      }
      if (result.errors && result.errors.length > 0) {
        setGenericError(true);
        return;
      } else if (result.data) {
        const normalizedId = client.cache.identify({
          pornstar_url_slug: props.pornstar_url_slug,
          __typename: "PornstarWithTags",
        });
        client.cache.evict({ id: normalizedId });
        client.cache.gc();

        props.setModalIsOpen(false);
        setSuccessText("Pornstar Deleted");
        showSuccessfulPopup();
        //router.push("/dashboard");
        //router.back();
        const referrer = document.referrer;

        // If the referrer contains "/dashboard" or is the same domain
        if (
          referrer.includes(window.location.hostname) &&
          referrer.includes("/dashboard")
        ) {
          router.back(); // Go back to the previous page
        } else {
          router.push("/dashboard"); // Redirect to the dashboard
        }
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
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
          <span>{props.pornstar_name} will be removed from all pornstars</span>
          <div className={styles["sign-up-button-container"]}>
            <button className={styles["sign-up-button"]} type="submit">
              Delete
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
