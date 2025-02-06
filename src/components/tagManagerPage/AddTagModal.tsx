import React, { FormEvent, useState, useEffect, useRef } from "react";
//import styles from './AddTagModal.module.scss';
import { ADD_USER_TAG } from "@/mutations/userTagMutations";
import { useMutation } from "@apollo/client";
import useInput from "../hooks/useInput";
import { useApolloClient } from "@apollo/client";
import Modal from "../utilities/Modal";
import FormInput from "../utilities/FormInput";
import FormInputInvalidMessage from "../utilities/FormInputInvalidMessage";
import FormSubmitButton from "../utilities/FormSubmitButton";
import { gql } from "@apollo/client";
import { useSuccessAlertContext } from "@/contexts/ShowSuccessAlertContext";

interface propDefs {
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AddTagModal({ setModalIsOpen }: propDefs) {
  console.log("addtag comp called");
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

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Focus the input element when the component mounts
    inputRef.current?.focus();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  // clears the error message the user starts typing again
  useEffect(() => {
    if (uniqueTagIsInvalid) setUniqueTagIsInvalid(false);
  }, [tag]);

  const { showSuccessfulPopup, setSuccessText, setTriggeredFrom } =
    useSuccessAlertContext();

  const [uniqueTagIsInvalid, setUniqueTagIsInvalid] = useState(false);

  const [genericError, setGenericError] = useState(false);
  const [versionError, setVersionError] = useState(false);
  const [rateLimitError, setRateLimitError] = useState(false);

  const client = useApolloClient();

  const addActorHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await addUserTag();
      if (!result) {
        setGenericError(true);
        return;
      }
      if (result.errors && result.errors.length > 0) {
        const errorCode = result.errors[0].extensions?.code;

        switch (errorCode) {
          case "TAG_ALREADY_EXISTS":
            setUniqueTagIsInvalid(true);
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
      } else if (result.data) {
        client.cache.modify({
          fields: {
            getUserTags(existingUserTags = []) {
              const newUserTagRef = client.cache.writeFragment({
                data: {
                  __typename: "UserTagsWithActorTagsReturn",
                  user_tag_id: result.data.addUserTag.user_tag_id,
                  user_tag_text: tag.toLowerCase(),
                },
                fragment: gql`
                  fragment NewActor on UserTagsWithActorTagsReturn {
                    user_tag_id
                    user_tag_text
                  }
                `,
              });
              return [...existingUserTags, newUserTagRef];
            },
          },
        });

        setModalIsOpen(false);
        setSuccessText("Tag added");
        setTriggeredFrom("TAGMANAGER");
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
      versionError={versionError}
      rateLimitError={rateLimitError}
      onSubmit={addActorHandler}
    >
      <FormInput
        inputIsInvalid={tagIsInvalid || uniqueTagIsInvalid}
        label="Tag"
        placeholder="tag"
        onChangeHandler={tagChangeHandler}
        onBlurHandler={tagBlurHandler}
        value={tag}
        inputRef={inputRef}
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
