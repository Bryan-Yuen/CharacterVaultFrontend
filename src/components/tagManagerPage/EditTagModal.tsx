import React, { FormEvent, useEffect, useState } from "react";
//import styles from "./EditTagModal.module.scss";
import { EDIT_USER_TAG } from "@/mutations/userTagMutations";
import { useMutation } from "@apollo/client";
import useInput from "../hooks/useInput";
import { useApolloClient } from "@apollo/client";
import Modal from "../utilities/Modal";
import FormInput from "../utilities/FormInput";
import FormInputInvalidMessage from "../utilities/FormInputInvalidMessage";
import FormSubmitButton from "../utilities/FormSubmitButton";

interface propDefs {
  user_tag_id: number;
  user_tag_text: string;
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function EditTagModal({
  user_tag_id,
  user_tag_text,
  setModalIsOpen,
}: propDefs) {
  const {
    input: tag,
    inputIsValid: tagIsValid,
    inputIsInvalid: tagIsInvalid,
    inputChangeHandler: tagChangeHandler,
    inputBlurHandler: tagBlurHandler,
    setInput: setTag,
  } = useInput((input) => input.length >= 1);

  const client = useApolloClient();

  const [editUserTag, { loading }] = useMutation(EDIT_USER_TAG, {
    variables: {
      editUserTagInput: {
        user_tag_id: user_tag_id,
        user_tag_text: tag.toLowerCase(),
      },
    },
    errorPolicy: "all",
  });

  // initiliaze tag state with text
  useEffect(() => {
    setTag(user_tag_text);
  }, []);

  // clears the error message the user starts typing again
  useEffect(() => {
    if (uniqueTagIsInvalid) setUniqueTagIsInvalid(false);
  }, [tag]);

  const [uniqueTagIsInvalid, setUniqueTagIsInvalid] = useState(false);
  const [genericError, setGenericError] = useState(false);

  const editPornstarHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const result = await editUserTag();
      if (!result) {
        setGenericError(true);
        return;
      }
      if (result.errors && result.errors.length > 0) {
        if (result.errors[0].extensions.code === "TAG_ALREADY_EXISTS") {
          setUniqueTagIsInvalid(true);
        } else setGenericError(true);
      } else if (result.data) {
        console.log(result.data);
        console.log("it worked");

        await client.refetchQueries({
          include: ["GetUserTags"],
        });

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
      header="Edit Tag"
      genericError={genericError}
      onSubmit={editPornstarHandler}
    >
      <FormInput
        inputIsInvalid={tagIsInvalid || uniqueTagIsInvalid}
        label="Tag"
        placeholder="tag"
        onChangeHandler={tagChangeHandler}
        onBlurHandler={tagBlurHandler}
        value={tag}
      >
        <FormInputInvalidMessage
          inputIsInvalid={tagIsInvalid}
          message="Tag cannot be blank."
        />
        <FormInputInvalidMessage
          inputIsInvalid={uniqueTagIsInvalid}
          message="Tag already exists."
        />
      </FormInput>
      <FormSubmitButton
        formIsInvalid={!tagIsValid}
        loading={loading}
        buttonText="Save"
      />
    </Modal>
  );
}
