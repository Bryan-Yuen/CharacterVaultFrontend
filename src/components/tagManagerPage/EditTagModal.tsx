import React, { FormEvent, useEffect, useState, useRef } from "react";
//import styles from "./EditTagModal.module.scss";
import { EDIT_USER_TAG } from "@/mutations/userTagMutations";
import { useMutation } from "@apollo/client";
import useInput from "../hooks/useInput";
import { useApolloClient } from "@apollo/client";
import Modal from "../utilities/Modal";
import FormInput from "../utilities/FormInput";
import FormInputInvalidMessage from "../utilities/FormInputInvalidMessage";
import FormSubmitButton from "../utilities/FormSubmitButton";
import { GET_ALL_ACTORS_AND_TAGS } from "@/queries/actorQueries";
import { gql } from "@apollo/client";
import { useSuccessAlertContext } from '@/contexts/ShowSuccessAlertContext';

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
    errorPolicy: "all"
  });

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Focus the input element when the component mounts
    inputRef.current?.focus();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  // initiliaze tag state with text
  useEffect(() => {
    setTag(user_tag_text);
  }, []);

  // clears the error message the user starts typing again
  useEffect(() => {
    if (uniqueTagIsInvalid) setUniqueTagIsInvalid(false);
  }, [tag]);

  const {showSuccessfulPopup , setSuccessText, setTriggeredFrom} = useSuccessAlertContext();

  const [uniqueTagIsInvalid, setUniqueTagIsInvalid] = useState(false);

  const [genericError, setGenericError] = useState(false);
  const [versionError, setVersionError] = useState(false);
  const [rateLimitError, setRateLimitError] = useState(false);

  const editActorHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const result = await editUserTag();
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
        client.cache.writeFragment({
          id:
            'UserTagsWithActorTagsReturn:{"user_tag_id":' +
            result.data.editUserTag.user_tag_id +
            "}",
          data: {
            __typename: "UserTagsWithActorTagsReturn",
            user_tag_id: result.data.editUserTag.user_tag_id,
            user_tag_text: tag.toLowerCase(),
          },
          fragment: gql`
            fragment NewUserTag on UserTagsWithActorTagsReturn {
              user_tag_id
              user_tag_text
            }
          `,
        });

        // refetch so the dashboard page is accurate
        // in the future maybe delete this from cache instead, in case the user deletes and edits multiple tags so we just refresh 1 time
        await client.query({
          query: GET_ALL_ACTORS_AND_TAGS,
          fetchPolicy: "network-only",
        });

        // delete cache individual get actors queries from cache
        const cacheData = client.cache.extract(); // Extract the entire cache

        // Loop through all keys in the cache
        for (const key in cacheData) {
          if (key.startsWith("ActorWithTagsAndLinks:")) {
            client.cache.evict({ id: key }); // Evict each specific entry
          }
        }

        // Garbage collect to clean up dangling references
        client.cache.gc();

        setModalIsOpen(false);
        setSuccessText("Tag added")
        setTriggeredFrom("TAGMANAGER")
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
      header="Edit Tag"
      genericError={genericError}
      versionError={versionError}
      rateLimitError={rateLimitError}
      onSubmit={editActorHandler}
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
        buttonText="Save"
      />
    </Modal>
  );
}
