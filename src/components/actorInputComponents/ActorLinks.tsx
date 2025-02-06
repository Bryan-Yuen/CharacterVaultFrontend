import React, { ChangeEvent,memo  } from 'react';
import styles from './ActorLinks.module.scss';

export interface ActorLinkObj {
  actor_link_title: string;
  actor_link_url: string;
}

interface propDefs {
  actorLinks: ActorLinkObj[];
  setactorLinks: React.Dispatch<React.SetStateAction<ActorLinkObj[]>>
}


export default memo(function actorLinks({ actorLinks, setactorLinks }: propDefs) {
  const addInput = () => {
    const newInputList = [...actorLinks, { actor_link_title: '', actor_link_url: '' }]; // Add an empty input
    setactorLinks(newInputList);
    console.log(actorLinks)
  };

  const removeLink = (index : number) => {
    const newInputList = [...actorLinks];
    newInputList.splice(index,1)
    setactorLinks(newInputList);
  };

  const handleTitleInputChange = (index : number, event: ChangeEvent<HTMLInputElement>) => {
    const newInputList = [...actorLinks];
    newInputList[index].actor_link_title = event.target.value;
    setactorLinks(newInputList);
  };

  
  const handleUrlInputChange = (index : number, event: ChangeEvent<HTMLInputElement>) => {
    const newInputList = [...actorLinks];
    newInputList[index].actor_link_url = event.target.value;
    setactorLinks(newInputList);
  };

  return (
    <div className={styles['links-container']}>
      <div className={styles['add-links-button-container']}>
      <button type="button" onClick={addInput} className={styles['add-links-button']}>
        Add Video Link
      </button>
      </div>
      <ul className={styles['links-list-container']}>
        {actorLinks.map((input, index) => (
          <li key={index}>
            <div className={styles['x-button']} onClick={() => removeLink(index)}>&times;</div>
            <label className={styles['title-label']}>Title</label>
            <input
              type="text"
              placeholder="Title/Studio/Notes (Optional)"
              value={input.actor_link_title}
              onChange={(event) => handleTitleInputChange(index, event)}
            />
            <label className={styles['url-label']}>URL</label>
            <input
              type="text"
              placeholder="Video Link (Optional)"
              value={input.actor_link_url}
              onChange={(event) => handleUrlInputChange(index, event)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
});
