import React, { useState, ChangeEvent, useRef,   KeyboardEvent, } from "react";
import styles from "./SearchBar.module.scss";
import { GET_USER_TAGS } from "@/queries/userTagQueries";
import { useQuery } from "@apollo/client";
import { useActorAndTagsContext } from "@/contexts/ActorAndTagsContext";
import Loading from "@/components/utilities/Loading";
import ErrorMessage from "@/components/utilities/ErrorMessage";

export default function SearchBar() {
  const {
    actorTags,
    setActorTags,
    tagsToggle,
    setTagsToggle,
    setNameSearchTerm,
    accountTags,
    setAccountTags,
  } = useActorAndTagsContext();

  const { loading, error, data } = useQuery(GET_USER_TAGS, {
    onCompleted: (data) => {
      setAccountTags(data.getUserTags.map((item: any) => item.user_tag_text));
    },
  });

  const [resultsDropdownIsOpen, setResultsDropdownIsOpen] =
    useState<boolean>(false);

  const [searchTerm, setSearchTerm] = useState<string>("");
  // handle when user clicks the input bar to make dropdown
  const [clicked, setClicked] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  //tags
  const filteredData = accountTags
    .sort()
    .filter((item) => item.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleClickInside = () => {
    //setClicked((oldClickStatus) => !oldClickStatus)
    //setClickedInsideInput(true)
    if (!resultsDropdownIsOpen) setResultsDropdownIsOpen(true);
    setClicked(true);
  };

  const handleClickOutside = () => {
    //setClicked((oldClickStatus) => !oldClickStatus)
    //setClickedInsideInput(true)
    if (resultsDropdownIsOpen) setResultsDropdownIsOpen(false);
    setClicked(false);
  };

  // need to make sure it doesn't already exist in Actor tags array
  const handleTagClick = (tag: string) => {
    // honestly this is here because our create new tag button calls this function too
    // but i guess this can also serve as a safeguard for the regular tag click even though that
    // does remove it from the search array

    //check if this works or if we need to compare the string inside to the string
    if (!actorTags.includes(tag)) {
      setActorTags([...actorTags, tag]);
      // need to remove from the search bar now
      setAccountTags((prevItems) => prevItems.filter((item) => item !== tag));
      // resets the input
      setSearchTerm("");
      setNameSearchTerm("")
      // consider if this is appropriate for clicking an item or leaving the search term there.
      //setSearchTerm('');
      // on mobile we do not want focus because the keyboard will keep showing up. only desktop is good
      if (inputRef.current) inputRef.current.focus();
    }
  };

  // we only do something if tagstoggle is true
  const handleKeyPress = (
      event: KeyboardEvent<HTMLInputElement>
      //tag: string
    ) => {
      if (event.key === "Enter" && tagsToggle) {
        event.preventDefault();
  
        if (!actorTags.includes(searchTerm)) {
          // new tag
          if (filteredData.length <= 0)
            // do nothing
            return;
          else {
            // gets first elem from filtered search bar results
            setActorTags([...actorTags, filteredData[0]]);
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
      {resultsDropdownIsOpen && (
        <div className={styles["backdrop"]} onClick={handleClickOutside}></div>
      )}
      <div onClick={(e) => e.stopPropagation()} className={styles["modal"]}>
        <div
          className={`${styles["search-input-container"]} ${styles[clickedInsideClass]}`}
        >
          <input
            type="text"
            className={styles["search-input"]}
            placeholder="Filter by tags or Search by Name"
            value={searchTerm}
            onClick={handleClickInside}
            onKeyDown={handleKeyPress}
            ref={inputRef}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setSearchTerm(event.target.value);
              setNameSearchTerm(event.target.value);
            }}
          />
          <div className={styles["checkbox"]}>
            <input
              type="checkbox"
              onChange={() => setTagsToggle((prev) => !prev)}
            />
            <label>
              <span></span>
            </label>
          </div>
        </div>
        {resultsDropdownIsOpen && tagsToggle && (
          <ul className={styles["search-results-container"]}>
            {filteredData.length === 0 && (
              <li key={"new"} className={styles["search-item-container"]}>
                "{searchTerm}" tag does not exist
              </li>
            )}
            {filteredData.map((item) => (
              <li
                key={item}
                onClick={() => handleTagClick(item)}
                className={styles["search-item-container"]}
              >
                <span className={styles["search-item"]}>{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
