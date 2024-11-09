import React, { FormEvent, useState } from "react";
import styles from "./DeleteTagModal.module.scss";
import { DELETE_USER_TAG } from "@/mutations/userTagMutations";
import { useMutation } from "@apollo/client";
import { useApolloClient } from "@apollo/client";
import Modal from "../utilities/Modal";
import FormSubmitButton from "../utilities/FormSubmitButton";

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

  const [deleteUserTag, { loading }] = useMutation(DELETE_USER_TAG, {
    variables: {
      userTagId: {
        user_tag_id: user_tag_id,
      },
    },
    errorPolicy: "all",
  });

  const deletePornstarHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await deleteUserTag();
      if (!result) {
        setGenericError(true);
        return;
      }
      if (result.errors) {
        setGenericError(true);
      } else if (result.data) {
        console.log(result.data);

        const normalizedId = client.cache.identify({
          user_tag_id: user_tag_id,
          __typename: "UserTag",
        });
        client.cache.evict({ id: normalizedId });
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
      onSubmit={deletePornstarHandler}
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
