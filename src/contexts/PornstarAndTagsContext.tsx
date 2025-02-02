import React, { useContext, createContext, useState } from "react";

type PornstarAndTagsContextProviderProps = {
  children: React.ReactNode;
};

export interface FullPornstar {
  pornstar_url_slug: string;
  pornstar_name: string;
  pornstar_picture_path: string;
  pornstar_tags_text: string[];
}

type PornstarAndTagsContext = {
  pornstarTags: string[];
  setPornstarTags: React.Dispatch<React.SetStateAction<string[]>>;
  accountTags: string[];
  setAccountTags: React.Dispatch<React.SetStateAction<string[]>>;
  tagsToggle: boolean;
  setTagsToggle: React.Dispatch<React.SetStateAction<boolean>>;
  nameSearchTerm: string;
  setNameSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  filteredPornstarByTags: FullPornstar[];
  setFilteredPornstarByTags: React.Dispatch<
    React.SetStateAction<FullPornstar[]>
  >;
  filteredPornstarByName: FullPornstar[];
  setFilteredPornstarByName: React.Dispatch<
    React.SetStateAction<FullPornstar[]>
  >;
};

// this is used to manage teh search bar and the dashboard. pornstar tags just means the selected tags from the search bar
export const PornstarAndTagsContext =
  createContext<PornstarAndTagsContext | null>(null);

// will change tagtoggle later
export default function PornstarAndTagsContextProvider({
  children,
}: PornstarAndTagsContextProviderProps) {
  const [nameSearchTerm, setNameSearchTerm] = useState<string>("");
  const [tagsToggle, setTagsToggle] = useState<boolean>(true);
  const [accountTags, setAccountTags] = useState<string[]>([]);
  const [pornstarTags, setPornstarTags] = useState<string[]>([]);
  const [filteredPornstarByTags, setFilteredPornstarByTags] = useState<
    FullPornstar[]
  >([]);
  const [filteredPornstarByName, setFilteredPornstarByName] = useState<
    FullPornstar[]
  >([]);

  return (
    <PornstarAndTagsContext.Provider
      value={{
        pornstarTags,
        setPornstarTags,
        accountTags,
        setAccountTags,
        tagsToggle,
        setTagsToggle,
        nameSearchTerm,
        setNameSearchTerm,
        filteredPornstarByTags,
        setFilteredPornstarByTags,
        filteredPornstarByName,
        setFilteredPornstarByName,
      }}
    >
      {children}
    </PornstarAndTagsContext.Provider>
  );
}

export function usePornstarAndTagsContext() {
  const context = useContext(PornstarAndTagsContext);
  if (!context) {
    throw new Error(
      "usePornstarAndTagsContext must be used within PornstarAndTagsContextProvider"
    );
  }
  return context;
}
