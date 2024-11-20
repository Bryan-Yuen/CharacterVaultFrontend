import React, { useState, KeyboardEvent, ChangeEvent, useRef, useEffect } from 'react';
import OutsideClickDetector from '../utilities/OutsideClickDetector';
import styles from './Tags.module.scss';
import Image from 'next/image';
import { GET_USER_TAGS } from '@/queries/userTag';
import { ADD_USER_TAG } from '@/mutations/userTagMutations';
import { useQuery, useMutation, useApolloClient } from '@apollo/client';

interface propDefs {
  pornstarTags: PornstarTag[];
  setPornstarTags: React.Dispatch<React.SetStateAction<PornstarTag[]>>
}

export interface PornstarTag {
  tag_text: string
  user_tag: {
    user_tag_id: number;
  }
}

interface UserTag{
  user_tag_id: number,
  user_tag_text: string
}

export default function Tags({ pornstarTags, setPornstarTags }: propDefs) {

  const client = useApolloClient()

  const [accountTags, setAccountTags] = useState<UserTag[]>([])

  const { loading, error, data } = useQuery(GET_USER_TAGS
    // not necessary because we have useEffect
    /*
    , {
    onCompleted: (data) => {
      setAccountTags(data.getUserTags);
    }
  }
  */
  )

  useEffect(() => {
    // wait for both of these to finally be available
    if(pornstarTags && data)
    {
      //setAccountTags(data.getUserTags.filter((item : any) => !pornstarTags.includes(item.user_tag_text)))
      setAccountTags(data.getUserTags.filter((item : any) => !pornstarTags.map(obj => obj.tag_text).includes(item.user_tag_text)))
      console.log("im hit")
      console.log(pornstarTags)
      console.log(accountTags)
    }
  }, [pornstarTags,data]);

  const [addUserTag] = useMutation(ADD_USER_TAG, {
    errorPolicy: "all"
  });

  const [searchTerm, setSearchTerm] = useState<string>('');
  // handle when user clicks the input bar to make dropdown
  const [clicked, setClicked] = useState<boolean>(false);

  // not sure what this is for i'll investigate and delete later
  const parentRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredData = accountTags.sort().filter((item) =>
  item.user_tag_text.toLowerCase().includes(searchTerm.toLowerCase())
);

  /*
  const filteredData = accountTags.filter((item) =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );
  */

  const handleClick = () => {
    //setClicked((oldClickStatus) => !oldClickStatus)
    //setClickedInsideInput(true)
    if(!clicked)
      setClicked(true)
  };

  const handleOutsideClick = () => {
    setClicked(false);
  };

  // maybe focus the input when you drop down
  const toggleDownButton = () => {
    if(!clicked)
      if(inputRef.current)
        inputRef.current.focus();
    setClicked((prev) => !prev)
    console.log("hi")
    console.log(clicked)
  }

  const handleTagClickNew = async (tag: string) => {

    const result = await addUserTag({variables: {
      newUserTag: {
        user_tag_text: tag
      }
    }})
    if (result.errors)
    {
      console.log("there was errors")
      console.log(result)
      console.log(result.errors[0].extensions.code)
      // obviously put these code in a constant maybe in a file somewhere
    }
    else if (result.data)
    {
      await client.refetchQueries({
        include: ["GetUserTags"],
      });
      console.log("it worked")
      //router.push("/dashboard")
    }

    if (!pornstarTags.some(pornstarTag => pornstarTag.tag_text.includes(tag))) {
      setPornstarTags([...pornstarTags,
        {
          tag_text: tag,
          user_tag: {
            user_tag_id: result.data.addUserTag.user_tag_id
          }
        } 
      ]);
      // need to remove from the search bar now
      setAccountTags((prevItems) => prevItems.filter((item) => item.user_tag_text !== tag));
      // consider if this is appropriate for clicking an item or leaving the search term there.
      //setSearchTerm('');
      // on mobile we do not want focus because the keyboard will keep showing up. only desktop is good
      if(inputRef.current)
        inputRef.current.focus();

      setSearchTerm("")
      console.log("imsinde if")
    }
    //setSearchTerm("")
    console.log("outside if")
  }

  // need to make sure it doesn't already exist in pornstar tags array
  const handleTagClick = (user_tag_text: string, user_tag_id: number) => {
    // honestly this is here because our create new tag button calls this function too
    // but i guess this can also serve as a safeguard for the regular tag click even though that
    // does remove it from the search array

    //check if this works or if we need to compare the string inside to the string
    if (!pornstarTags.some(pornstarTag => pornstarTag.tag_text.includes(user_tag_text))) {
      setPornstarTags([...pornstarTags,
        {
          tag_text: user_tag_text,
          user_tag: {
            user_tag_id: user_tag_id
          }
        } 
      ]);
      console.log(user_tag_text)
      console.log(accountTags)
      // need to remove from the search bar now
      //setAccountTags((prevItems) => prevItems.filter((item) => item.user_tag_text !== user_tag_text));
      // consider if this is appropriate for clicking an item or leaving the search term there.
      //setSearchTerm('');
      // on mobile we do not want focus because the keyboard will keep showing up. only desktop is good
      if(inputRef.current)
        inputRef.current.focus();
      
      setSearchTerm("")
    }
  };

  const removeTag = (tag: string, user_tag_id: number) => {
    //setClicked((oldClickStatus) => !oldClickStatus)
    setPornstarTags((prevItems : PornstarTag[]) => prevItems.filter((item) => item.tag_text !== tag));
    setAccountTags([...accountTags, 
      {
        user_tag_id: user_tag_id,
        user_tag_text: tag
      }
    ]);
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
  const clickedInsideClass = clicked ? 'input-active' : ''

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error! {error.message}</div>;

  console.log("refeesh?",pornstarTags)
  return (
    <>
      <span className={styles['tags-label']}>Tags</span>
      <OutsideClickDetector onOutsideClick={handleOutsideClick}>
        {pornstarTags.length > 0 && (
          <div className={styles['selected-tags-container']}>
            <ul>
              {pornstarTags.map((item, i) => (
              <li key={i} onClick={() => removeTag(item.tag_text, item.user_tag.user_tag_id)}>
                <span className={styles['selected-tag']}>{item.tag_text}</span>
                <Image
              priority
              src="/x.svg"
              alt="x"
              height={11}
              width={11}
              className={styles['x-button']}
            />
              </li>
              ))}
            </ul>
          </div>
        )}
        <div className={`${styles['search-input-container']} ${styles[clickedInsideClass]}`}>
          <input
            type="text"
            className={styles['search-input']}
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
          <div className={styles['down-button-container']} onClick={toggleDownButton}>
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
            <ul className={styles['search-results-container']}>
              {filteredData.length === 0 && (
                <li key={'new'} onClick={() => handleTagClickNew(searchTerm)} className={styles['search-item-container']}>
                  Create new tag "{searchTerm}"
                </li>
              )}
              {filteredData.map((item) => (
                <li
                  key={item.user_tag_id}
                  onClick={() => handleTagClick(item.user_tag_text, item.user_tag_id)}
                  className={styles['search-item-container']}
                >
                  <span className={styles['search-item']}>{item.user_tag_text}</span>
                </li>
              ))}
            </ul>
        )}
      </OutsideClickDetector>
    </>
  );
}
