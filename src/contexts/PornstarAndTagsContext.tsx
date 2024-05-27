import React, {useContext, createContext, useState} from 'react'

type PornstarAndTagsContextProviderProps = {
  children: React.ReactNode;
}

type PornstarAndTagsContext = {
  pornstarTags : string[];
  setPornstarTags : React.Dispatch<React.SetStateAction<string[]>>;
  accountTags : string[];
  setAccountTags : React.Dispatch<React.SetStateAction<string[]>>;
  tagsToggle : boolean
  setTagsToggle :  React.Dispatch<React.SetStateAction<boolean>>
  nameSearchTerm : string;
  setNameSearchTerm : React.Dispatch<React.SetStateAction<string>>
}

export const PornstarAndTagsContext = createContext<PornstarAndTagsContext | null>(null)

// will change tagtoggle later
export default function PornstarAndTagsContextProvider({children} : PornstarAndTagsContextProviderProps) {
  const [nameSearchTerm, setNameSearchTerm] = useState<string>('');
  const [tagsToggle, setTagsToggle] = useState<boolean>(true);
  const [accountTags, setAccountTags] = useState<string[]>([]);
  const [pornstarTags, setPornstarTags] = useState<string[]>([]);


  return (
    <PornstarAndTagsContext.Provider value={{
      pornstarTags,
      setPornstarTags,
      accountTags,
      setAccountTags,
      tagsToggle,
      setTagsToggle,
      nameSearchTerm,
      setNameSearchTerm
    }}>
      {children}
    </PornstarAndTagsContext.Provider>
  )
}

export function usePornstarAndTagsContext() {
  const context = useContext(PornstarAndTagsContext);
  if(!context) {
    throw new Error("usePornstarAndTagsContext must be used within PornstarAndTagsContextProvider")
  }
  return context;
} 
