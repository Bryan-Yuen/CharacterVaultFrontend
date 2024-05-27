import {useState, ChangeEvent} from 'react'
import {
    formatDate,
    FormatDateOptions,
  } from "cleave-zen";

  const dateOptions: FormatDateOptions = {
    datePattern: ["m", "y"],
  };

export default function useExpirationDateInput(validateInput : (e : string) => boolean) {
  const [input, setInput] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [raw, setRaw] = useState<string>('');
  const [isTouched, setIsTouched] =
    useState<boolean>(false);
  const inputIsValid = validateInput(input)
  const inputIsInvalid = !inputIsValid && isTouched

  const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
    const value = formatDate(e.target.value, dateOptions);
    setInput(value);
  }

  const inputBlurHandler = () => {
    setIsTouched(true)
  }

  return {
    input,
    type,
    raw,
    inputIsValid,
    inputIsInvalid,
    inputChangeHandler,
    inputBlurHandler,
    setInput
  }
}
