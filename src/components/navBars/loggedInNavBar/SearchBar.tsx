import React, {
  useState,
  KeyboardEvent,
  ChangeEvent,
  useRef,
  useEffect,
  useContext,
} from 'react';
import OutsideClickDetector from '../../utilities/OutsideClickDetector';
import styles from './SearchBar.module.scss';
import Image from 'next/image';
import { GET_USER_TAGS } from '@/queries/userTagQueries';
import { ADD_USER_TAG } from '@/mutations/userTag';
import { useQuery, useMutation } from '@apollo/client';
import { usePornstarAndTagsContext } from '@/contexts/PornstarAndTagsContext';
import { ThreeDots } from "react-loader-spinner";

export default function SearchBar() {
  const {
    pornstarTags,
    setPornstarTags,
    tagsToggle,
    setTagsToggle,
    setNameSearchTerm,
    accountTags,
    setAccountTags
  } = usePornstarAndTagsContext();

  //const [accountTags, setAccountTags] = useState<string[]>([]);

  const { loading, error, data } = useQuery(GET_USER_TAGS, {
    onCompleted: (data) => {
      setAccountTags(data.getUserTags.map((item: any) => item.user_tag_text));
    },
  });

  const [resultsDropdownIsOpen, setResultsDropdownIsOpen] = useState<boolean>(false);

  const [searchTerm, setSearchTerm] = useState<string>('');
  // handle when user clicks the input bar to make dropdown
  const [clicked, setClicked] = useState<boolean>(false);

  // not sure what this is for i'll investigate and delete later
  const parentRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  //tags
  const filteredData = accountTags.sort().filter((item) =>
  item.toLowerCase().includes(searchTerm.toLowerCase())
);

  const handleClick = () => {
    //setClicked((oldClickStatus) => !oldClickStatus)
    //setClickedInsideInput(true)
    if (!resultsDropdownIsOpen) setResultsDropdownIsOpen(true);
  };

  const handleOutsideClick = () => {
    setClicked(false);
  };

  // maybe focus the input when you drop down
  const toggleDownButton = () => {
    if (!clicked) if (inputRef.current) inputRef.current.focus();
    setClicked((prev) => !prev);
    console.log('hi');
    console.log(clicked);
  };


  // need to make sure it doesn't already exist in pornstar tags array
  const handleTagClick = (tag: string) => {
    // honestly this is here because our create new tag button calls this function too
    // but i guess this can also serve as a safeguard for the regular tag click even though that
    // does remove it from the search array

    //check if this works or if we need to compare the string inside to the string
    if (!pornstarTags.includes(tag)) {
      setPornstarTags([...pornstarTags, tag]);
      // need to remove from the search bar now
      setAccountTags((prevItems) => prevItems.filter((item) => item !== tag));
      // resets the input
      setSearchTerm('')
      // consider if this is appropriate for clicking an item or leaving the search term there.
      //setSearchTerm('');
      // on mobile we do not want focus because the keyboard will keep showing up. only desktop is good
      if (inputRef.current) inputRef.current.focus();
    }
  };

  const removeTag = (tag: string) => {
    //setClicked((oldClickStatus) => !oldClickStatus)
    setPornstarTags((prevItems: string[]) =>
      prevItems.filter((item) => item !== tag)
    );
    setAccountTags([...accountTags, tag]);
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
  const clickedInsideClass = clicked ? 'input-active' : '';

  if (loading)
    return (
      <ThreeDots
        visible={true}
        height="80"
        width="80"
        color="rgb(22, 122, 207);"
        radius="9"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    );
  if (error) return <div>Error! {error.message}</div>;
  console.log("what is usertagdata",data)
  return (
    <>
    {resultsDropdownIsOpen && <div
      className={styles["backdrop"]}
      onClick={() => setResultsDropdownIsOpen(false)}
    >
      </div>}
      <div onClick={(e) => e.stopPropagation()} className={styles["modal"]}>
        <div
          className={`${styles['search-input-container']} ${styles[clickedInsideClass]}`}
        >
          <input
            type="text"
            className={styles['search-input']}
            placeholder="Filter by tags or Search by Name"
            value={searchTerm}
            onClick={handleClick}
            ref={inputRef}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setSearchTerm(event.target.value);
              setNameSearchTerm(event.target.value);
            }}
            /*
            onKeyDown={(event: KeyboardEvent<HTMLInputElement>) =>
              handleKeyPress(event, searchTerm)
            }
            */
          />
                <div className={styles['checkbox']}>
      <input type="checkbox" onChange={() => setTagsToggle((prev) => !prev)}/>
      <label>
        <span></span>
      </label>
    </div>
        </div>
        {resultsDropdownIsOpen && tagsToggle && (
          <ul className={styles['search-results-container']}>
            {filteredData.length === 0 && (
              <li
                key={'new'}
                className={styles['search-item-container']}
              >
                "{searchTerm}" tag does not exist
              </li>
            )}
            {filteredData.map((item) => (
              <li
                key={item}
                onClick={() => handleTagClick(item)}
                className={styles['search-item-container']}
              >
                <span className={styles['search-item']}>{item}</span>
              </li>
            ))}
          </ul>
        )}
        </div>
        </>
  );
}
