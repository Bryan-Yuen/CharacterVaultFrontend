import React, { useEffect, useState, ChangeEvent, useRef } from 'react';
import styles from './TagManager.module.scss';
import { GET_USER_TAGS } from '@/queries/userTag';
import { useQuery, useMutation } from '@apollo/client';
import { useApolloClient } from '@apollo/client';
import EditTagModal from './EditTagModal';
import AddTagModal from './AddTagModal';
import DeleteTagModal from './DeleteTagModal';
import Image from 'next/image';
import SuccessPopUp from '../utilities/SuccessPopUp';
// definitely need lazy loading here, maybe just show a few over the page
// depending on screen size, and as user scrolls load more.
export default function TagManagerBody() {
  const client = useApolloClient();
  const { loading, error, data } = useQuery(
    GET_USER_TAGS /*{
    onCompleted: (data) => {
      setAccountTags(data.getUserTags);
    }
  }*/
  );

  const [addModalIsOpen, setAddModalIsOpen] = useState<boolean>(false);

  const [editModalIsOpen, setEditModalIsOpen] = useState<boolean>(false);

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState<boolean>(false);

  const [successPopUpIsOpen, setSuccessPopUpIsOpen] = useState<boolean>(false);

  const [selectedTagText, setSelectedTagText] = useState<string>('');
  const [selectedTagId, setSelectedTagId] = useState<number>(0);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [clicked, setClicked] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const showSuccessfulPopup = () => {
    setSuccessPopUpIsOpen(true);
    /*
    setTimeout(() => {
      setSuccessPopUpIsOpen(false);
    }, 5000)
    */
  }

  const handleEditTagClick = (tagId: number, tagText: string) => {
    setSelectedTagText(tagText);
    setSelectedTagId(tagId);
    setEditModalIsOpen(true);
  };

  const handleDeleteTagClick = (tagId: number, tagText: string) => {
    setSelectedTagText(tagText);
    setSelectedTagId(tagId);
    setDeleteModalIsOpen(true);
  };

  const clickedInsideClass = clicked ? 'input-active' : '';

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error! {error.message}</div>;

  console.log("what is data",data)
  const sortedData = [...(data.getUserTags)].sort((a : any, b : any) => a.user_tag_text.localeCompare(b.user_tag_text))

  const filteredData = sortedData.filter((item: any) =>
    item.user_tag_text.toLowerCase().includes(searchTerm.toLowerCase())
  );
  /*
  const filteredData = data.getUserTags.filter((item: any) =>
    item.user_tag_text.toLowerCase().includes(searchTerm.toLowerCase())
  );
  */

  return (
    <div className={styles['component-container']}>
        <div className={styles['modal-header']}>
          <h2 className={styles['modal-title']}>Tag Manager</h2>
          <button className={styles['add-tag-button']} onClick={() => setAddModalIsOpen(true)}>Add Tag</button>
        </div>
        <div
          className={`${styles['search-input-container']} ${styles[clickedInsideClass]}`}
        >
          <input
            type="text"
            className={styles['search-input']}
            placeholder="Search"
            value={searchTerm}
            ref={inputRef}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(event.target.value)
            }
          />
        </div>
        <ul className={styles['search-results-container']}>
          {filteredData.length === 0 && (
            <li
              key={'new'}
              className={styles['search-item-container']}
            >
              Empty
            </li>
          )}
          {filteredData.map((item: any) => (
            <li
              key={item.user_tag_id}
              className={styles['search-item-container']}
            >
              <span className={styles['search-item']}>{item.user_tag_text}</span>
              <div>
                <button
                  className={styles['edit-button']}
                  onClick={() =>
                    handleEditTagClick(item.user_tag_id, item.user_tag_text)
                  }
                >
                  <Image
                    priority
                    src="/pencil-icon.svg"
                    alt="penicil Icon"
                    height={20}
                    width={20}
                  />
                </button>
                <button className={styles['delete-button']} onClick={() => handleDeleteTagClick(item.user_tag_id, item.user_tag_text)}>
                <Image
                    priority
                    src="/trash-can-icon.svg"
                    alt="trash can Icon"
                    height={20}
                    width={20}
                  />
                </button>
              </div>
            </li>
          ))}
        </ul>
      {editModalIsOpen && (
        <EditTagModal
          user_tag_id={selectedTagId}
          user_tag_text={selectedTagText}
          setModalIsOpen={setEditModalIsOpen}
        />
      )}
      {deleteModalIsOpen && (
        <DeleteTagModal
        user_tag_id={selectedTagId}
        user_tag_text={selectedTagText}
        setModalIsOpen={setDeleteModalIsOpen}
        />
      )}
      {addModalIsOpen && <AddTagModal setModalIsOpen={setAddModalIsOpen} showSuccessfulPopup={showSuccessfulPopup}/>}
      {successPopUpIsOpen && <SuccessPopUp/>}
    </div>
  );
}
