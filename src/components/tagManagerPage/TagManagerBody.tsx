import React, { useState, ChangeEvent, useRef } from "react";
import styles from "./TagManager.module.scss";
import { GET_USER_TAGS } from "@/queries/userTagQueries";
import { useQuery } from "@apollo/client";
import EditTagModal from "./EditTagModal";
import AddTagModal from "./AddTagModal";
import DeleteTagModal from "./DeleteTagModal";
import Image from "next/image";
import Loading from "../utilities/Loading";
import Error from "../utilities/Error";
import OutsideClickDetector from "../utilities/OutsideClickDetector";
import { useSuccessAlertContext } from "@/contexts/ShowSuccessAlertContext";
import SuccessPopUp from "../utilities/SuccessPopUp";

// definitely need lazy loading here, maybe just show a few over the page
// depending on screen size, and as user scrolls load more.
export default function TagManagerBody() {
  const { loading, error, data } = useQuery(GET_USER_TAGS);

  const [addModalIsOpen, setAddModalIsOpen] = useState<boolean>(false);

  const [editModalIsOpen, setEditModalIsOpen] = useState<boolean>(false);

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState<boolean>(false);

  const { successAlertIsOpen, successText } = useSuccessAlertContext();

  const [selectedTagText, setSelectedTagText] = useState<string>("");
  const [selectedTagId, setSelectedTagId] = useState<number>(0);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [clicked, setClicked] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (!clicked) setClicked(true);
  };

  const handleOutsideClick = () => {
    setClicked(false);
  };

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

  const clickedInsideClass = clicked ? "input-active" : "";

  if (loading) return <Loading />;
  if (error) {
    if (error.graphQLErrors && error.graphQLErrors.length > 0) {
      const errorCode = error.graphQLErrors[0].extensions.code;

      switch (errorCode) {
        case "VERSION_ERROR":
          return (
            <Error>
              Version Error. A new web version is available. Please refresh your
              page.
            </Error>
          );
        case "RATE_LIMIT_ERROR":
          return (
            <Error>
              Too many requests for this resource. Please wait and try again
              again later. Contact support if you think this is was an error.
            </Error>
          );
        default:
          return (
            <Error>
              Error loading tags. Please refresh the page and try again.
              <br></br>
              If error persists please contact support@myfapsheet.com for help
            </Error>
          );
      }
    }
    return (
      <Error>
        Error loading tags. Please refresh the page and try again.
        <br></br>
        If error persists please contact support@myfapsheet.com for help
      </Error>
    );
  }

  const sortedData = [...data.getUserTags].sort((a: any, b: any) =>
    a.user_tag_text.localeCompare(b.user_tag_text)
  );

  const filteredData = sortedData.filter((item: any) =>
    item.user_tag_text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles["component-container"]}>
      {successAlertIsOpen && <SuccessPopUp successText={successText} />}
      <div className={styles["modal-header"]}>
        <h2 className={styles["modal-title"]}>Tag Manager</h2>
        <button
          className={styles["add-tag-button"]}
          onClick={() => setAddModalIsOpen(true)}
        >
          Add Tag
        </button>
      </div>
      <OutsideClickDetector onOutsideClick={handleOutsideClick}>
        <div
          className={`${styles["search-input-container"]} ${styles[clickedInsideClass]}`}
        >
          <input
            type="text"
            className={styles["search-input"]}
            placeholder="Search"
            onClick={handleClick}
            value={searchTerm}
            ref={inputRef}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(event.target.value)
            }
          />
        </div>
      </OutsideClickDetector>
      <ul className={styles["search-results-container"]}>
        {filteredData.length === 0 && searchTerm.length === 0 && (
          <li key={"new"} className={styles["search-item-container"]}>
            Tags Empty
          </li>
        )}
        {filteredData.length === 0 && searchTerm.length > 0 && (
          <li key={"new"} className={styles["search-item-container"]}>
            No tag exist with that term. Add new tag.
          </li>
        )}
        {filteredData.map((item: any) => (
          <li
            key={item.user_tag_id}
            className={styles["search-item-container"]}
          >
            <span className={styles["search-item"]}>{item.user_tag_text}</span>
            <div>
              <button
                className={styles["edit-button"]}
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
              <button
                className={styles["delete-button"]}
                onClick={() =>
                  handleDeleteTagClick(item.user_tag_id, item.user_tag_text)
                }
              >
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
      {addModalIsOpen && <AddTagModal setModalIsOpen={setAddModalIsOpen} />}
    </div>
  );
}
