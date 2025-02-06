import React from 'react'
import styles from './SearchSelectedTags.module.scss';
import { useActorAndTagsContext } from '@/contexts/ActorAndTagsContext';
import Image from 'next/image';

export default function SearchSelectedTags() {
  const {
    actorTags,
    setActorTags,
    accountTags,
    setAccountTags
  } = useActorAndTagsContext();

  const removeTag = (tag: string) => {
    //setClicked((oldClickStatus) => !oldClickStatus)
    setActorTags((prevItems: string[]) =>
      prevItems.filter((item) => item !== tag)
    );
    setAccountTags([...accountTags, tag]);
  };

  return (
    <>
      {actorTags.length > 0 && (
          <div className={styles['selected-tags-container']}>
            <h2 className={styles['selected-tags-title']}>Filtered Tags</h2>
            <ul>
              {actorTags.map((item) => (
                <li key={item} onClick={() => removeTag(item)}>
                  <span className={styles['selected-tag']}>{item}</span>
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
        </>
  )
}
