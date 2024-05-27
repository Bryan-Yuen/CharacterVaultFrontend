import React, { ChangeEvent  } from 'react';
import styles from './PornstarLinks.module.scss';

export interface PornstarLinkObj {
  pornstar_link_title: string;
  pornstar_link_url: string;
}

interface propDefs {
  pornstarLinks: PornstarLinkObj[];
  setPornstarLinks: React.Dispatch<React.SetStateAction<PornstarLinkObj[]>>
}


export default function PornstarLinks({ pornstarLinks, setPornstarLinks }: propDefs) {
  console.log("i am in link comp")
  const addInput = () => {
    const newInputList = [...pornstarLinks, { pornstar_link_title: '', pornstar_link_url: '' }]; // Add an empty input
    setPornstarLinks(newInputList);
    console.log(pornstarLinks)
  };

  const removeLink = (index : number) => {
    const newInputList = [...pornstarLinks];
    newInputList.splice(index,1)
    setPornstarLinks(newInputList);
  };

  const handleTitleInputChange = (index : number, event: ChangeEvent<HTMLInputElement>) => {
    const newInputList = [...pornstarLinks];
    newInputList[index].pornstar_link_title = event.target.value;
    setPornstarLinks(newInputList);
  };

  
  const handleUrlInputChange = (index : number, event: ChangeEvent<HTMLInputElement>) => {
    const newInputList = [...pornstarLinks];
    newInputList[index].pornstar_link_url = event.target.value;
    setPornstarLinks(newInputList);
  };

  return (
    <div className={styles['links-container']}>
      <div className={styles['add-links-button-container']}>
      <button type="button" onClick={addInput} className={styles['add-links-button']}>
        Add Video Links
      </button>
      </div>
      <ul className={styles['links-list-container']}>
        {pornstarLinks.map((input, index) => (
          <li key={index}>
            <div className={styles['x-button']} onClick={() => removeLink(index)}>&times;</div>
            <label className={styles['title-label']}>Title</label>
            <input
              type="text"
              placeholder="Title/Studio/Notes"
              value={input.pornstar_link_title}
              onChange={(event) => handleTitleInputChange(index, event)}
            />
            <label className={styles['url-label']}>URL</label>
            <input
              type="text"
              placeholder="Video Link"
              value={input.pornstar_link_url}
              onChange={(event) => handleUrlInputChange(index, event)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
