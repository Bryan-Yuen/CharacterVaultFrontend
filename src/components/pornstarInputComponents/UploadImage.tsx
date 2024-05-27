import React, { useState, DragEvent, ChangeEvent, useRef, ClipboardEvent, memo } from 'react';
import styles from './UploadImage.module.scss';
import Image from 'next/image';

export enum ImageUpdateStatus {
  AddOrEdit = 'ADD_OR_EDIT',
  Delete = 'DELETE',
  NoChange = 'NO_CHANGE',
}

export interface ImageUpdates {
  didChange: boolean;
  didDelete: boolean;
}

interface propDefs {
  selectedImage: File | null;
  setSelectedImage: React.Dispatch<React.SetStateAction<File | null>>;
  pornstar_picture_path?: string | null;
  setImageUpdate?: React.Dispatch<React.SetStateAction<ImageUpdates>>;
  imageUpdate?: ImageUpdates
}

const UploadImage = ({
  selectedImage,
  setSelectedImage,
  pornstar_picture_path,
  setImageUpdate,
  imageUpdate
}: propDefs) => {
  const [onDragOver, setOnDragOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [pornstarPicturePath, setPornstarPicturePath] = useState<
  string | null | undefined
>(pornstar_picture_path);

  const dropHandler = (e: DragEvent<HTMLDivElement>) => {
    // Prevent default behavior (Prevent file from being opened)
    e.preventDefault();

    const file = e.dataTransfer.files[0];
    // checks for null and if its a image type
    if (file && file.type.indexOf('image') !== -1) {
      if(setImageUpdate && imageUpdate)
      {
        setImageUpdate({
          ...imageUpdate,
          didChange: true
        })
      }
      setSelectedImage(file);
    }

    if (onDragOver) setOnDragOver(false);
  };

  const dragOverHandler = (e: DragEvent<HTMLDivElement>) => {
    // Prevent default behavior (Prevent file from being opened)
    e.preventDefault();
    // Handle dragover event
    console.log('File(s) in drop zone');
    // This event will fire many times, so this is for performance
    if (!onDragOver) setOnDragOver(true);
  };

  const dragLeaveHandler = (e: DragEvent<HTMLDivElement>) => {
    // Prevent default behavior (Prevent file from being opened)
    e.preventDefault();
    // Handle dragover event
    console.log('File(s) Left!');
    // resets the drag container background back to normal
    if (onDragOver) setOnDragOver(false);
  };

  const handleClick = () => {
    if(fileInputRef.current !== null)
    fileInputRef.current.click();
  };

  const pasteHandler = (e: ClipboardEvent<HTMLDivElement>) => {
    // Prevent default behavior (Prevent file from being opened)
    e.preventDefault();
    console.log("aba")
   /*
    const items = (e.clipboardData || e.nativeEvent.clipboardData).items;

    for (const item of items) {
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        setSelectedImage(file)
      }
    }
    */

    // maybe see if we have to check for null here or why we don't
    //setSelectedImage(e.dataTransfer.files[0]);
    //if (onDragOver) setOnDragOver(false);
  };

  const fileInputChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    console.log(event);
    if (event.target.files !== null) {
      console.log(event.target.files[0]);
      // there is a change also check if this exist because this is optional
      console.log("fireeee")
      if(setImageUpdate && imageUpdate)
      {
        setImageUpdate({
          ...imageUpdate,
          didChange: true
        })
      }
      setSelectedImage(event.target.files[0]);
    }
    console.log("test if delete triggers")
  }

  const deleteImageHandler = () => {
    setSelectedImage(null)
    setPornstarPicturePath(null)
    if(setImageUpdate && imageUpdate)
      {
        setImageUpdate({
          ...imageUpdate,
          didDelete: true
        })
      }
  }

  // i may consider putting this inside the code just so i can recognize its a ternary statement inside
  const onDragOverClass = onDragOver ? 'onDragOver' : '';

  // in the future check that !check at the bottom, it looks too bandagy we can check it out later but now it works
  return (
    <div className={styles['upload-image-container']}>
      <label>Upload Image</label>
      {selectedImage || pornstarPicturePath ? (
        <div>
                    <Image
            priority
            src={selectedImage ? URL.createObjectURL(selectedImage) : pornstarPicturePath!}
            alt="user uploaded image"
            className={styles['image']}
            width={300}
            height={450}
          />
          <br />
          <button onClick={deleteImageHandler} className={styles['remove-button']}>Remove/Add New Image</button>
        </div>
      ) : (
        <div
          className={`${styles['drop-zone']} ${styles[onDragOverClass]}`}
          onDrop={dropHandler}
          onDragOver={dragOverHandler}
          onDragLeave={dragLeaveHandler}
          onPaste={pasteHandler}
        >
          <input
            type="file"
            accept="image/*"
            name="myImage"
            className={styles['file-upload-input']}
            ref={fileInputRef}
            onChange={fileInputChangeHandler}
          />
          <Image
            priority
            src="/uploadIcon.svg"
            alt="Upload Icon"
            height={32}
            width={32}
          />
          <span className={styles['file-upload-container-text']} onClick={handleClick}>Upload Picture</span>
          <span className={styles['file-upload-container-text']}>Drag & Drop or Copy & Paste</span>
        </div>
      )}
    </div>
  );
}

export default memo(UploadImage);