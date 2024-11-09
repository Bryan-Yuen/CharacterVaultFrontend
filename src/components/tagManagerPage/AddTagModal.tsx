import React, { FormEvent, useState, useEffect } from "react";
//import styles from './AddTagModal.module.scss';
import { ADD_USER_TAG } from "@/mutations/userTagMutations";
import { useMutation } from "@apollo/client";
import useInput from "../hooks/useInput";
import { useApolloClient } from "@apollo/client";
import Modal from "../utilities/Modal";
import FormInput from "../utilities/FormInput";
import FormInputInvalidMessage from "../utilities/FormInputInvalidMessage";
import FormSubmitButton from "../utilities/FormSubmitButton";

interface propDefs {
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  showSuccessfulPopup: () => void;
}

export default function AddTagModal({
  setModalIsOpen,
  showSuccessfulPopup,
}: propDefs) {
  const {
    input: tag,
    inputIsValid: tagIsValid,
    inputIsInvalid: tagIsInvalid,
    inputChangeHandler: tagChangeHandler,
    inputBlurHandler: tagBlurHandler,
  } = useInput((input) => input.length >= 1);

  const [addUserTag, { loading }] = useMutation(ADD_USER_TAG, {
    variables: {
      newUserTag: {
        user_tag_text: tag.toLowerCase(),
      },
    },
    errorPolicy: "all",
  });

  // clears the error message the user starts typing again
  useEffect(() => {
    if (uniqueTagIsInvalid) setUniqueTagIsInvalid(false);
  }, [tag]);

  const [uniqueTagIsInvalid, setUniqueTagIsInvalid] = useState(false);
  const [genericError, setGenericError] = useState(false);

  const client = useApolloClient();

  const addPornstarHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await addUserTag();
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
        showSuccessfulPopup();
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      setGenericError(true);
    }
  };

  return (
    <Modal
      setModal={setModalIsOpen}
      header="Add Tag"
      genericError={genericError}
      onSubmit={addPornstarHandler}
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
        buttonText="Add"
      />
    </Modal>
  );
}
