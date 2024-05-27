import React, {useContext, createContext, useState} from 'react'

type SuccessAlertIsOpenContextProviderProps = {
  children: React.ReactNode;
}

// had any there we might change it back if we get errors
type SuccessAlertIsOpenContext = {
  successAlertIsOpen : boolean;
  setSuccessAlertIsOpen : React.Dispatch<React.SetStateAction<boolean>>;
}

export const SuccessAlertIsOpenContext = createContext<SuccessAlertIsOpenContext | null>(null)

// will change tagtoggle later
export default function SuccessAlertIsOpenContextProvider({children} : SuccessAlertIsOpenContextProviderProps) {
  const [successAlertIsOpen, setSuccessAlertIsOpen] = useState<boolean>(false);

  console.log("im in context", successAlertIsOpen)
  return (
    <SuccessAlertIsOpenContext.Provider value={{
      successAlertIsOpen,
      setSuccessAlertIsOpen
    }}>
      {children}
    </SuccessAlertIsOpenContext.Provider>
  )
}

export function useSuccessAlertContext() {
  const context = useContext(SuccessAlertIsOpenContext);
  if(!context) {
    throw new Error("useSuccessAlertContext must be used within useSuccessAlertContextProvider")
  }
  return context;
} 
