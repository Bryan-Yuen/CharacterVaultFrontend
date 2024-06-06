import React, { useState, FormEvent, useEffect} from 'react';
import styles from './AddPornstarBody.module.scss';
import { useRouter } from 'next/navigation';
import useInput from '../hooks/useInput';
import UploadImage from '../pornstarInputComponents/UploadImage';
import PornstarName from '../pornstarInputComponents/PornstarName';
import Tags from '../pornstarInputComponents/Tags';
import { gql } from '@apollo/client';
import { useApolloClient } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client';
import { ADD_PORNSTAR } from '@/mutations/pornstarMutations';
import PornstarLinks from '../pornstarInputComponents/PornstarLinks';
import MobileUploadImage from '../pornstarInputComponents/MobileUploadImage';
import Link from "next/link";
//import { useSuccessAlertContext } from '@/contexts/ShowSuccessAlertContext';

export interface PornstarLinkObj {
  pornstar_link_title: string;
  pornstar_link_url: string;
}

export interface PornstarTag {
  tag_text: string
  user_tag: {
    user_tag_id: number;
  }
}

export default function AddPornstarBody() {
  const {
    input: pornstarName,
    inputIsValid: pornstarNameIsValid,
    inputIsInvalid: pornstarNameIsInvalid,
    inputChangeHandler: pornstarNameChangeHandler,
    inputBlurHandler: pornstarNameBlurHandler,
  } = useInput((input) => input.length >= 1);

  const router = useRouter();
  const client = useApolloClient();

  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const [pornstarTags, setPornstarTags] = useState<PornstarTag[]>([]);

  const [pornstarLinks, setPornstarLinks] = useState<PornstarLinkObj[]>([]);

  const [isDesktop, setDesktop] = useState(false);

  //const { successAlertIsOpen, setSuccessAlertIsOpen } = useSuccessAlertContext();

  useEffect(() => {
    const updateMedia = () => {
      if (window.innerWidth > 800) {
        setDesktop(true);
      } else {
        setDesktop(false);
      }
    };

    updateMedia()

    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  }, []);

  const [addPornstar] = useMutation(ADD_PORNSTAR, {
    variables: {
      newPornstarInput: {
        pornstar_name: pornstarName,
        pornstar_picture: selectedImage !== null,
        pornstar_tags_obj: pornstarTags,
        pornstar_links_title_url: pornstarLinks,
      },
    },
    errorPolicy: 'all',
    /*
    update(cache, { data: { addPornstar } }) {
      // Read the existing cache data
      const result : any = cache.readQuery({ query: GET_ALL_PORNSTARS });
      console.log('test10900')
      console.log(result)
      const getAllPornstars = result.getAllPornstars
      console.log(getAllPornstars)
      // Update the cache with the new data
      cache.writeQuery({
        query: GET_ALL_PORNSTARS,
        data: { getAllPornstars: [...getAllPornstars, addPornstar.pornstar] },
      });
    },
    */
   /*
    refetchQueries: [
      { query: GET_ALL_PORNSTARS_AND_TAGS },
     'getAllPornstarsAndTags'
   ]
   */
  });

  // later on look up how we should handle errors on the client side
  // because technically if our app is good we shouldn't have errors unless the client
  // is changing code to break our stuff or maybe 1% chance the network or internet technical difficulties
  const addPornstarHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(!pornstarNameIsValid)
    {
      pornstarNameBlurHandler()
      return;
    }

    const result = await addPornstar();
    if (result.errors) {
      console.log('there was errors');
      console.log(result);
      console.log(result.errors[0].extensions.code);
      // obviously put these code in a constant maybe in a file somewhere
    } else if (result.data) {
      console.log(result.data);
      console.log('it worked');
      //router.push("/dashboard")
    }
    console.log(result.data);
    // could make the url null and only fetch if the url is not null
    const url = result.data.addPornstar.s3Url;

    console.log(selectedImage);
    console.log(pornstarTags);
    console.log('data', url);
    console.log(selectedImage?.type);

    await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': selectedImage?.type || '',
      },
      body: selectedImage,
    });
    const imageUrl = url.split('?')[0];
    const imageKey = imageUrl.split('/')[3]
    const newImageUrl = "https://pub-f8c29b76b6bc4836aac4b8dabb8b6b25.r2.dev/" + imageKey
    console.log('imageurl');
    console.log(imageUrl);
    console.log("url",url)

    client.cache.modify({
      fields: {
        getAllPornstarsAndTags(existingPornstars = []) {
          const newPornstarRef = client.cache.writeFragment({
            data:{
              __typename: 'PornstarWithTags',
              pornstar_id: result.data.addPornstar.pornstar_id,
                pornstar_name: pornstarName,
                pornstar_picture_path: selectedImage ? newImageUrl : null,
                pornstar_tags_text: pornstarTags.map((tagObj: any) => tagObj.tag_text)
            },
            fragment: gql`
              fragment NewPornstar on PornstarWithTags {
                pornstar_id
                pornstar_name
                pornstar_picture_path
                pornstar_tags_text
              }
            `,
          });
          console.log("aaaaaaaaaaaaaaaaaaaaa")
          return [...existingPornstars, newPornstarRef];
        },
      },
    });

    //setSuccessAlertIsOpen(true);
    router.push('/dashboard');
  };

  return (
    <div className={styles['component-container']}>
      <form
        className={styles['flex-form-container']}
        onSubmit={addPornstarHandler}
      >
        <h2 className={styles['header']}>Add Pornstar</h2>
        <div className={styles['second-row']}>
          {isDesktop && <UploadImage
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
          />}
          <div className={styles['flex-child-right-side']}>
            <PornstarName
              pornstarName={pornstarName}
              pornstarNameIsInvalid={pornstarNameIsInvalid}
              pornstarNameChangeHandler={pornstarNameChangeHandler}
              pornstarNameBlurHandler={pornstarNameBlurHandler}
            />
                      {!isDesktop && <MobileUploadImage
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
          />}
            <Tags pornstarTags={pornstarTags} setPornstarTags={setPornstarTags} />
            <PornstarLinks
              pornstarLinks={pornstarLinks}
              setPornstarLinks={setPornstarLinks}
            />
          </div>
        </div>
        <div className={styles['buttons-container']}>
            <Link
          href={"/dashboard"}
          className={`${styles["cancel-button"]}`}
        >
          Cancel
        </Link>
            <button
              type="submit"
              className={`${styles["add-pornstar-button"]}`}
            >
              Save
            </button>
        </div>
      </form>
    </div>
  );
}
