import React, {
  useState,
  KeyboardEvent,
  ChangeEvent,
  useRef,
  useEffect,
} from "react";
import OutsideClickDetector from "../utilities/OutsideClickDetector";
import styles from "./Tags.module.scss";
import Image from "next/image";
import { GET_USER_TAGS } from "@/queries/userTagQueries";
import { ADD_USER_TAG } from "@/mutations/userTagMutations";
import { useQuery, useMutation, useApolloClient } from "@apollo/client";

interface propDefs {
  pornstarTags: string[];
  setPornstarTags: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function Tags({ pornstarTags, setPornstarTags }: propDefs) {
  const client = useApolloClient();

  const [accountTags, setAccountTags] = useState<string[]>([]);

  const { loading, error, data } = useQuery(GET_USER_TAGS);

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
      console.log("im in useeffect tags");
    }
  }, [pornstarTags, data]);

  const [addUserTag] = useMutation(ADD_USER_TAG, {
    errorPolicy: "all",
  });

  const [searchTerm, setSearchTerm] = useState<string>("");
  // handle when user clicks the input bar to make dropdown
  const [clicked, setClicked] = useState<boolean>(false);
  const [genericError, setGenericError] = useState(false);

  // not sure what this is for i'll investigate and delete later
  const parentRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredData = accountTags
    .sort()
    .filter((accountTag) =>
      accountTag.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleClick = () => {
    if (!clicked) setClicked(true);
  };

  const handleOutsideClick = () => {
    setClicked(false);
  };

  // maybe focus the input when you drop down
  const toggleDownButton = () => {
    if (!clicked) if (inputRef.current) inputRef.current.focus();
    setClicked((prev) => !prev);
    console.log("hi");
    console.log(clicked);
  };

  const handleTagClickNew = async (tag: string) => {
    console.log("im in new tag add")
    try {
      const result = await addUserTag({
        variables: {
          newUserTag: {
            user_tag_text: tag.toLowerCase(),
          },
        },
      });
      if (result.errors && result.errors.length > 0) {
        console.log("there was errors");
        setGenericError(true);
        return;
      } else if (result.data) {

        // needed because of use effect is dependent on the updated database data
        await client.refetchQueries({
          include: ["GetUserTags"],
        });

  
      if (!pornstarTags.some((pornstarTag) => pornstarTag.includes(tag))) {
        setPornstarTags([...pornstarTags, tag]);
        // need to remove from the search bar now
        setAccountTags((prevItems) => prevItems.filter((item) => item !== tag));
        // consider if this is appropriate for clicking an item or leaving the search term there.
        //setSearchTerm('');
        // on mobile we do not want focus because the keyboard will keep showing up. only desktop is good
        if (inputRef.current) inputRef.current.focus();
  
        setSearchTerm("");
        console.log("imsinde if");
      }
      //setSearchTerm("")
      console.log("outside if");
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
    console.log(accountTags)
  };

  // need to make sure it doesn't already exist in pornstar tags array
  /*
  const handleKeyPress = (
    event: KeyboardEvent<HTMLInputElement>,
    tag: string
  ) => {
    if (event.key === 'Enter') {
      if (!pornstarTags.includes(tag)) {
        // new tag
        if (filteredData.length <= 0)
          // send notification or alert user new tag created for the account in the background
          //setAccountTags([...accountTags, tag]);
          setPornstarTags([...pornstarTags, tag]);
        else {
          // gets first elem from filtered search bar results
          setPornstarTags([...pornstarTags, filteredData[0]]);
          // need to remove from the search bar now
          setAccountTags((prevItems) =>
            prevItems.filter((item) => item !== filteredData[0])
          );
        }
        setSearchTerm('');
      }
    }
  };
  */
  const clickedInsideClass = clicked ? "input-active" : "";

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error! {error.message}</div>;

  console.log(accountTags)
  console.log("refeesh?", pornstarTags);
  return (
    <>
      <span className={styles["tags-label"]}>Tags{accountTags.map(item => item)}</span>
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
            className={styles["search-input"]}
            placeholder="Select or Create Tag"
            value={searchTerm}
            onClick={handleClick}
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
        {clicked && (
          <ul className={styles["search-results-container"]}>
            {filteredData.length === 0 && (
              <li
                key={"new"}
                onClick={() => handleTagClickNew(searchTerm)}
                className={styles["search-item-container"]}
              >
                Create new tag "{searchTerm}"
              </li>
            )}
            {filteredData.map((accountTagText) => (
              <li
                key={Math.random() * 100}
                onClick={() => handleTagClick(accountTagText)}
                className={styles["search-item-container"]}
              >
                <span className={styles["search-item"]}>{accountTagText}</span>
              </li>
            ))}
          </ul>
        )}
      </OutsideClickDetector>
    </>
  );
}
