import React, { useContext, createContext, useState } from "react";

type ActorAndTagsContextProviderProps = {
  children: React.ReactNode;
};

export interface FullActor {
  actor_url_slug: string;
  actor_name: string;
  actor_picture_path: string;
  actor_tags_text: string[];
}

type ActorAndTagsContext = {
  actorTags: string[];
  setActorTags: React.Dispatch<React.SetStateAction<string[]>>;
  accountTags: string[];
  setAccountTags: React.Dispatch<React.SetStateAction<string[]>>;
  tagsToggle: boolean;
  setTagsToggle: React.Dispatch<React.SetStateAction<boolean>>;
  nameSearchTerm: string;
  setNameSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  filteredActorByTags: FullActor[];
  setFilteredActorByTags: React.Dispatch<
    React.SetStateAction<FullActor[]>
  >;
  filteredActorByName: FullActor[];
  setFilteredActorByName: React.Dispatch<
    React.SetStateAction<FullActor[]>
  >;
};

// this is used to manage teh search bar and the dashboard. actor tags just means the selected tags from the search bar
export const ActorAndTagsContext =
  createContext<ActorAndTagsContext | null>(null);

// will change tagtoggle later
export default function actorAndTagsContextProvider({
  children,
}: ActorAndTagsContextProviderProps) {
  const [nameSearchTerm, setNameSearchTerm] = useState<string>("");
  const [tagsToggle, setTagsToggle] = useState<boolean>(true);
  const [accountTags, setAccountTags] = useState<string[]>([]);
  const [actorTags, setActorTags] = useState<string[]>([]);
  const [filteredActorByTags, setFilteredActorByTags] = useState<
    FullActor[]
  >([]);
  const [filteredActorByName, setFilteredActorByName] = useState<
    FullActor[]
  >([]);

  return (
    <ActorAndTagsContext.Provider
      value={{
        actorTags,
        setActorTags,
        accountTags,
        setAccountTags,
        tagsToggle,
        setTagsToggle,
        nameSearchTerm,
        setNameSearchTerm,
        filteredActorByTags,
        setFilteredActorByTags,
        filteredActorByName,
        setFilteredActorByName,
      }}
    >
      {children}
    </ActorAndTagsContext.Provider>
  );
}

export function useActorAndTagsContext() {
  const context = useContext(ActorAndTagsContext);
  if (!context) {
    throw new Error(
      "useActorAndTagsContext must be used within actorAndTagsContextProvider"
    );
  }
  return context;
}
