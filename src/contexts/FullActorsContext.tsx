import React, {useContext, createContext, useState} from 'react'
import { GET_ALL_ACTORS_AND_TAGS } from "@/queries/actorQueries";
import { useQuery, ApolloError} from "@apollo/client";

export interface FullActor {
  actor_url_slug: string;
  actor_name: string;
  actor_picture_path: string;
  actor_tags_text: string[];
}

type FullactorsContextProviderProps = {
  children: React.ReactNode;
}

// had any there we might change it back if we get errors
type FullactorsContext = {
  fullActors : FullActor[];
  setFullActors : React.Dispatch<React.SetStateAction<FullActor[]>>;
  actorsData : any;
  actorsLoading : boolean;
  actorsError?: ApolloError;
}

export const FullActorsContext = createContext<FullactorsContext | null>(null)

// will change tagtoggle later
export default function FullactorsContextProvider({children} : FullactorsContextProviderProps) {
  const [fullActors, setFullActors] = useState<FullActor[]>([]);

  const {
    loading: actorsLoading,
    error: actorsError,
    data: actorsData,
  } = useQuery(GET_ALL_ACTORS_AND_TAGS, {
    onCompleted: (data) => {
      setFullActors(data.getAllActorsAndTags);
    }
  });

  return (
    <FullActorsContext.Provider value={{
      fullActors,
      setFullActors,
      actorsData,
      actorsLoading,
      actorsError
    }}>
      {children}
    </FullActorsContext.Provider>
  )
}

export function useFullActorsContext() {
  const context = useContext(FullActorsContext);
  if(!context) {
    throw new Error("useactorAndTagsContext must be used within actorAndTagsContextProvider")
  }
  return context;
} 
