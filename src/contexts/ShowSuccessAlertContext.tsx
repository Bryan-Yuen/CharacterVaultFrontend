import React, {useContext, createContext, useState} from 'react'

type SuccessAlertIsOpenContextProviderProps = {
  children: React.ReactNode;
}

// had any there we might change it back if we get errors
type SuccessAlertIsOpenContext = {
  successText : string;
  setSuccessText: React.Dispatch<React.SetStateAction<string>>;
  successAlertIsOpen : boolean;
  setSuccessAlertIsOpen : React.Dispatch<React.SetStateAction<boolean>>;
  showSuccessfulPopup: () => void;
}

export const SuccessAlertIsOpenContext = createContext<SuccessAlertIsOpenContext | null>(null)

// will change tagtoggle later
export default function SuccessAlertIsOpenContextProvider({children} : SuccessAlertIsOpenContextProviderProps) {
  const [successAlertIsOpen, setSuccessAlertIsOpen] = useState<boolean>(false);
  const [successText, setSuccessText] = useState<string>('');

  const showSuccessfulPopup = () => {
    setSuccessAlertIsOpen(true);

    setTimeout(() => {
      console.log("settimeout called")
      // reset
      setSuccessAlertIsOpen(false);
      setSuccessText('')
    }, 3000);
  };

  console.log("im in context", successAlertIsOpen)
  return (
    <SuccessAlertIsOpenContext.Provider value={{
      successAlertIsOpen,
      setSuccessAlertIsOpen,
      showSuccessfulPopup,
      successText,
      setSuccessText
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
