import React, { useState, ChangeEvent, useRef, memo } from "react";
import styles from "./MobileUploadImage.module.scss";
import Image from "next/image";
import { MAX_FILE_SIZE, ACTOR_IMAGE_WIDTH, ACTOR_IMAGE_HEIGHT } from "@/constants/constants";

export enum ImageUpdateStatus {
  AddOrEdit = "ADD_OR_EDIT",
  Delete = "DELETE",
  NoChange = "NO_CHANGE",
}

export interface ImageUpdates {
  didChange: boolean;
  didDelete: boolean;
}

interface propDefs {
  selectedImage: File | null;
  setSelectedImage: React.Dispatch<React.SetStateAction<File | null>>;
  actor_picture_path?: string | null;
  setImageUpdate?: React.Dispatch<React.SetStateAction<ImageUpdates>>;
  imageUpdate?: ImageUpdates;
}

export default memo(function MobileUploadImage({
  selectedImage,
  setSelectedImage,
  actor_picture_path,
  setImageUpdate,
  imageUpdate,
}: propDefs) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [actorPicturePath, setactorPicturePath] = useState<
    string | null | undefined
  >(actor_picture_path);

  const handleClick = () => {
    if (fileInputRef.current !== null) fileInputRef.current.click();
  };

  const fileInputChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    console.log(event);
    if (event.target.files !== null) {
      if (event.target.files[0].size > MAX_FILE_SIZE) {
        alert("Error: Image file size must be 3Mb or less.");
        return;
      }
      console.log(event.target.files[0]);
      // there is a change also check if this exist because this is optional
      console.log("fireeee");
      if (setImageUpdate && imageUpdate) {
        setImageUpdate({
          ...imageUpdate,
          didChange: true,
        });
      }
      setSelectedImage(event.target.files[0]);
    }
    console.log("test if delete triggers");
  };

  const deleteImageHandler = () => {
    setSelectedImage(null);
    setactorPicturePath(null);
    if (setImageUpdate && imageUpdate) {
      setImageUpdate({
        ...imageUpdate,
        didDelete: true,
      });
    }
  };

  // in the future check that !check at the bottom, it looks too bandagy we can check it out later but now it works
  return (
    <div className={styles["upload-image-container"]}>
      {selectedImage || actorPicturePath ? (
        <div>
          <Image
            priority
            //loader={CDNImageLoader}
            unoptimized={true}
            src={
              selectedImage
                ? URL.createObjectURL(selectedImage)
                : actorPicturePath!
            }
            alt="user uploaded image"
            className={styles["image"]}
            width={ACTOR_IMAGE_WIDTH}
            height={ACTOR_IMAGE_HEIGHT}
          />
          <br />
          <button
            onClick={deleteImageHandler}
            className={styles["remove-button"]}
          >
            Remove/Add New Image
          </button>
        </div>
      ) : (
        <>
          <input
            type="file"
            accept="image/*"
            name="myImage"
            className={styles["file-upload-input"]}
            ref={fileInputRef}
            onChange={fileInputChangeHandler}
          />
          <button type="button"  className={styles["file-upload-button"]}
            onClick={handleClick}>Upload Image</button>
        </>
      )}
    </div>
  );
});
