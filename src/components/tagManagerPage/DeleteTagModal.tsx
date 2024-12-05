import React, { FormEvent, useState } from "react";
//import styles from "./DeleteTagModal.module.scss";
import { DELETE_USER_TAG } from "@/mutations/userTagMutations";
import { useMutation } from "@apollo/client";
import { useApolloClient } from "@apollo/client";
import Modal from "../utilities/Modal";
import FormSubmitButton from "../utilities/FormSubmitButton";
import { GET_ALL_PORNSTARS_AND_TAGS } from "@/queries/pornstarsQueries";

interface propDefs {
  user_tag_id: number;
  user_tag_text: string;
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DeleteTagModal({
  user_tag_id,
  user_tag_text,
  setModalIsOpen,
}: propDefs) {
  const client = useApolloClient();

  const [genericError, setGenericError] = useState(false);
  const [versionError, setVersionError] = useState(false);
  const [rateLimitError, setRateLimitError] = useState(false);

  const [deleteUserTag, { loading }] = useMutation(DELETE_USER_TAG, {
    variables: {
      userTagId: {
        user_tag_id: user_tag_id,
      },
    },
  });

  const deleteUserTagHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await deleteUserTag();
      if (!result) {
        setGenericError(true);
        return;
      }
      if (result.errors) {
        const errorCode = result.errors[0].extensions?.code;

        switch (errorCode) {
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
        const normalizedId = client.cache.identify({
          user_tag_id: user_tag_id,
          __typename: "UserTag",
        });
        client.cache.evict({ id: normalizedId });
        client.cache.gc();

        // refetch so the dashboard page is accurate
        await client.query({
          query: GET_ALL_PORNSTARS_AND_TAGS,
          fetchPolicy: "network-only",
        });
        // delete cache individual get pornstars queries from cache
        const cacheData = client.cache.extract(); // Extract the entire cache

        // Loop through all keys in the cache
        for (const key in cacheData) {
          if (key.startsWith("PornstarWithTagsAndLinks:")) {
            client.cache.evict({ id: key }); // Evict each specific entry
          }
        }

        // Garbage collect to clean up dangling references
        client.cache.gc();

        setModalIsOpen(false);
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      setGenericError(true);
    }
  };

  return (
    <Modal
      setModal={setModalIsOpen}
      header="Confirm Delete"
      genericError={genericError}
      versionError={versionError}
      rateLimitError={rateLimitError}
      onSubmit={deleteUserTagHandler}
    >
      <span>{user_tag_text} will be removed from all pornstars</span>
      <FormSubmitButton
        formIsInvalid={false}
        loading={loading}
        buttonText="Delete"
        deleteButton={true}
      />
    </Modal>
  );
}
