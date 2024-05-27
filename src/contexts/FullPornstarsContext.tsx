import React, {useContext, createContext, useState} from 'react'
import { GET_ALL_PORNSTARS_AND_TAGS } from "@/queries/pornstars";
import { useQuery, ApolloError} from "@apollo/client";
/*
export interface PornstarTag {
  tag_text: string
  user_tag: {
    user_tag_id: number;
  }
}
*/

export interface FullPornstar {
  pornstar_id: number;
  pornstar_name: string;
  pornstar_picture_path: string;
  pornstar_tags_text: string[];
}

type FullPornstarsContextProviderProps = {
  children: React.ReactNode;
}

// had any there we might change it back if we get errors
type FullPornstarsContext = {
  fullPornstars : FullPornstar[];
  setFullPornstars : React.Dispatch<React.SetStateAction<FullPornstar[]>>;
  pornstarsData : any;
  pornstarsLoading : boolean;
  pornstarsError?: ApolloError;
}

export const FullPornstarsContext = createContext<FullPornstarsContext | null>(null)

// will change tagtoggle later
export default function FullPornstarsContextProvider({children} : FullPornstarsContextProviderProps) {
  const [fullPornstars, setFullPornstars] = useState<FullPornstar[]>([]);

  const {
    loading: pornstarsLoading,
    error: pornstarsError,
    data: pornstarsData,
  } = useQuery(GET_ALL_PORNSTARS_AND_TAGS, {
    onCompleted: (data) => {
      setFullPornstars(data.getAllPornstarsAndTags);
    },
  });

  return (
    <FullPornstarsContext.Provider value={{
      fullPornstars,
      setFullPornstars,
      pornstarsData,
      pornstarsLoading,
      pornstarsError
    }}>
      {children}
    </FullPornstarsContext.Provider>
  )
}

export function useFullPornstarsContext() {
  const context = useContext(FullPornstarsContext);
  if(!context) {
    throw new Error("usePornstarAndTagsContext must be used within PornstarAndTagsContextProvider")
  }
  return context;
} 
