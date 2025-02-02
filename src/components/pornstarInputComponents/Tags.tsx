import React, {
  useState,
  KeyboardEvent,
  ChangeEvent,
  useRef,
  useEffect,
  memo,
} from "react";
import OutsideClickDetector from "../utilities/OutsideClickDetector";
import styles from "./Tags.module.scss";
import Image from "next/image";
import { GET_USER_TAGS } from "@/queries/userTagQueries";
import { ADD_USER_TAG } from "@/mutations/userTagMutations";
import { useQuery, useMutation, useApolloClient } from "@apollo/client";
import Loading from "../utilities/Loading";
import ErrorMessage from "../utilities/ErrorMessage";
import GenericError from "../utilities/GenericError";
import MutationVersionError from "../utilities/MutationVersionError";
import RateLimitError from "../utilities/RateLimitError";
import { gql } from "@apollo/client";
import { RotatingLines } from "react-loader-spinner";

interface propDefs {
  pornstarTags: string[];
  setPornstarTags: React.Dispatch<React.SetStateAction<string[]>>;
}

export default memo(function Tags({ pornstarTags, setPornstarTags }: propDefs) {
  const client = useApolloClient();

  const [accountTags, setAccountTags] = useState<string[]>([]);

  const { loading, error, data } = useQuery(GET_USER_TAGS);

  const [addUserTag] = useMutation(ADD_USER_TAG);

  useEffect(() => {
    // wait for both of these to finally be available
    if (pornstarTags && data) {
      setAccountTags(
        data.getUserTags
          // first we filter to make sure each tag in account tags doesn't exist in pornstar tags
          .filter((item: any) => !pornstarTags.includes(item.user_tag_text))
          // then we convert the new filtered array of objects to only string array
          .map((item: any) => item.user_tag_text)
      );
    }
  }, [pornstarTags, data]);

  const [searchTerm, setSearchTerm] = useState<string>("");
  // handle when user clicks the input bar to make dropdown
  const [clicked, setClicked] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const handleFocus = () => setIsFocused(true);
  /*
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Prevent closing when clicking inside dropdown
    if (
      e.relatedTarget &&
      e.relatedTarget.closest(`.${styles["search-results-container"]}`)
    ) {
      return;
    }
    setIsFocused(false);
  };
  */
  const [createNewTagDisabled, setCreateNewTagDisabled] =
    useState<boolean>(false);

  const [genericError, setGenericError] = useState(false);
  const [versionError, setVersionError] = useState(false);
  const [rateLimitError, setRateLimitError] = useState(false);

  // for focus when clicked
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredData = accountTags
    .sort()
    .filter((accountTag) =>
      accountTag.toLowerCase().includes(searchTerm.toLowerCase())
    );

  /*
  const handleClick = () => {
    if (!clicked) setClicked(true);
  };

  */
  const handleOutsideClick = () => {
    setClicked(false);
    setIsFocused(false);
  };

  // maybe focus the input when you drop down
  const toggleDownButton = () => {
    if (!clicked) if (inputRef.current) inputRef.current.focus();
    setClicked((prev) => !prev);
  };

  const handleTagClickNew = async () => {
    if (!searchTerm) return;
    setCreateNewTagDisabled(true);
    try {
      const result = await addUserTag({
        variables: {
          newUserTag: {
            user_tag_text: searchTerm.toLowerCase(),
          },
        },
        errorPolicy: "all",
      });
      if (result.errors && result.errors.length > 0) {
        const errorCode = result.errors[0].extensions?.code;

        switch (errorCode) {
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
        // needed because of use effect is dependent on the updated database data
        /*
        await client.refetchQueries({
          include: ["GetUserTags"],
        });
        */
        // needed because of use effect is dependent on the updated database data
        client.cache.modify({
          fields: {
            getUserTags(existingUserTags = []) {
              const newUserTagRef = client.cache.writeFragment({
                data: {
                  __typename: "UserTag",
                  user_tag_id: result.data.addUserTag.user_tag_id,
                  user_tag_text: searchTerm.toLowerCase(),
                },
                fragment: gql`
                  fragment NewPornstar on UserTag {
                    user_tag_id
                    user_tag_text
                  }
                `,
              });
              return [...existingUserTags, newUserTagRef];
            },
          },
        });

        if (
          !pornstarTags.some((pornstarTag) =>
            pornstarTag.includes(searchTerm.toLowerCase())
          )
        ) {
          setPornstarTags([...pornstarTags, searchTerm.toLowerCase()]);
          // need to remove from the search bar now
          setAccountTags((prevItems) =>
            prevItems.filter((item) => item !== searchTerm.toLowerCase())
          );
          // consider if this is appropriate for clicking an item or leaving the search term there.
          //setSearchTerm('');
          // on mobile we do not want focus because the keyboard will keep showing up. only desktop is good
          if (inputRef.current) inputRef.current.focus();

          setSearchTerm("");
          setCreateNewTagDisabled(false);
        }
        //setSearchTerm("")
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      setGenericError(true);
    }
  };

  // need to make sure it doesn't already exist in pornstar tags array
  const handleTagClick = (user_tag_text: string) => {
    // honestly this is here because our create new tag button calls this function too
    // but i guess this can also serve as a safeguard for the regular tag click even though that
    // does remove it from the search array

    //check if this works or if we need to compare the string inside to the string
    if (
      !pornstarTags.some((pornstarTag) => pornstarTag.includes(user_tag_text))
    ) {
      setPornstarTags([...pornstarTags, user_tag_text]);
      console.log(user_tag_text);
      console.log(accountTags);
      // need to remove from the search bar now
      //setAccountTags((prevItems) => prevItems.filter((item) => item.user_tag_text !== user_tag_text));
      // consider if this is appropriate for clicking an item or leaving the search term there.
      //setSearchTerm('');
      // on mobile we do not want focus because the keyboard will keep showing up. only desktop is good
      if (inputRef.current) inputRef.current.focus();

      setSearchTerm("");
    }
  };

  const removeTag = (tag: string) => {
    //setClicked((oldClickStatus) => !oldClickStatus)
    setPornstarTags((prevItems: string[]) =>
      prevItems.filter((item) => item !== tag)
    );
    //setAccountTags([...accountTags, tag]);
    setAccountTags((prevItems: string[]) => [...prevItems, tag]);
    console.log(accountTags);
  };

  // need to make sure it doesn't already exist in pornstar tags array

  // in the future lets make the search term have greyed out letters of the first search term
  const handleKeyPress = (
    event: KeyboardEvent<HTMLInputElement>
    //tag: string
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();

      if (!pornstarTags.includes(searchTerm)) {
        // new tag
        if (filteredData.length <= 0)
          // send notification or alert user new tag created for the account in the background
          //setAccountTags([...accountTags, tag]);
          //setPornstarTags([...pornstarTags, searchTerm]);
          handleTagClickNew();
        else {
          // gets first elem from filtered search bar results
          setPornstarTags([...pornstarTags, filteredData[0]]);
          // need to remove from the search bar now
          setAccountTags((prevItems) =>
            prevItems.filter((item) => item !== filteredData[0])
          );
        }
        setSearchTerm("");
      }
    }
  };

  const clickedInsideClass = clicked ? "input-active" : "";

  if (loading) return <Loading />;
  if (error) {
    if (error.graphQLErrors && error.graphQLErrors.length > 0) {
      const errorCode = error.graphQLErrors[0].extensions.code;

      switch (errorCode) {
        case "VERSION_ERROR":
          return (
            <ErrorMessage>
              Version Error. A new web version is available. Please refresh your
              page.
            </ErrorMessage>
          );
        case "RATE_LIMIT_ERROR":
          return (
            <ErrorMessage>
              Too many requests for this resource. Please wait and try again
              again later. Contact support if you think this is was an error.
            </ErrorMessage>
          );
        default:
          return (
            <ErrorMessage>
              Error loading tags. Please refresh the page and try again.
              <br></br>
              If error persists please contact support@myfapsheet.com for help
            </ErrorMessage>
          );
      }
    }
    return (
      <ErrorMessage>
        Error loading tags. Please refresh the page and try again.
        <br></br>
        If error persists please contact support@myfapsheet.com for help
      </ErrorMessage>
    );
  }

  return (
    <>
      <label className={styles["tags-label"]} htmlFor="pornstar-tags">
        Tags
      </label>
      <OutsideClickDetector onOutsideClick={handleOutsideClick}>
        {pornstarTags.length > 0 && (
          <div className={styles["selected-tags-container"]}>
            <ul>
              {pornstarTags.map((tag, i) => (
                <li key={i} onClick={() => removeTag(tag)}>
                  <span className={styles["selected-tag"]}>{tag}</span>
                  <Image
                    priority
                    src="/x.svg"
                    alt="x"
                    height={11}
                    width={11}
                    className={styles["x-button"]}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}
        <div
          className={`${styles["search-input-container"]} ${styles[clickedInsideClass]}`}
        >
          <input
            type="text"
            id="pornstar-tags"
            className={styles["search-input"]}
            placeholder="Select or Create Tag"
            value={searchTerm}
            onKeyDown={handleKeyPress}
            onFocus={handleFocus}
            //onBlur={handleBlur} // Close only when clicking outside
            ref={inputRef}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(event.target.value)
            }
            /*
            onKeyDown={(event: KeyboardEvent<HTMLInputElement>) =>
              handleKeyPress(event, searchTerm)
            }
            */
          />
          <div
            className={styles["down-button-container"]}
            onClick={toggleDownButton}
          >
            <Image
              priority
              src="/downIcon.svg"
              alt="Down Icon"
              height={32}
              width={32}
            />
          </div>
        </div>
        {isFocused && (
          <ul className={styles["search-results-container"]}>
            {filteredData.map((accountTagText, i) => (
              <li
                key={i}
                onClick={() => handleTagClick(accountTagText)}
                className={styles["search-item-container"]}
              >
                <span className={styles["search-item"]}>{accountTagText}</span>
              </li>
            ))}
            {(filteredData.length < 1 || searchTerm !== filteredData[0]) &&
              searchTerm.length > 0 && (
                <li
                  key={"new"}
                  onClick={createNewTagDisabled ? undefined : handleTagClickNew}
                  className={styles["search-item-container"]}
                >
                  {createNewTagDisabled ? (
                    <RotatingLines
                      visible={true}
                      width="25"
                      strokeWidth="5"
                      strokeColor="white"
                      animationDuration="0.75"
                      ariaLabel="rotating-lines-loading"
                    />
                  ) : (
                    `Create new tag "${searchTerm}"`
                  )}
                </li>
              )}
          </ul>
        )}
      </OutsideClickDetector>
      <GenericError genericError={genericError} />
      <MutationVersionError versionError={versionError} />
      <RateLimitError rateLimitError={rateLimitError} />
    </>
  );
});
