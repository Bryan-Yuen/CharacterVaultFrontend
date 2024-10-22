import React, { FormEvent, useState, useEffect } from "react";
import styles from "./DeletePornstarModal.module.scss";
import { DELETE_PORNSTAR } from "@/mutations/pornstarMutations";
import { useMutation } from "@apollo/client";
import { useApolloClient } from "@apollo/client";
import { useRouter } from "next/navigation";

interface propDefs {
  pornstar_id: number;
  pornstar_name: string;
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DeletePornstarModal(props: propDefs) {
  const client = useApolloClient();
  const router = useRouter();
  const [genericError, setGenericError] = useState(false);

  const [deletePornstar] = useMutation(DELETE_PORNSTAR, {
    variables: {
      deletePornstarInput: {
        pornstar_id: props.pornstar_id,
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
          pornstar_id: props.pornstar_id,
          __typename: "PornstarWithTags",
        });
        client.cache.evict({ id: normalizedId });
        client.cache.gc();

        props.setModalIsOpen(false);
        router.back();
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
      </div>
    </div>
  );
}
