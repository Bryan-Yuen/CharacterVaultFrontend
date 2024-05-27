import {useState, ChangeEvent} from 'react'
import {
    formatCreditCard,
    getCreditCardType,
    unformatCreditCard,
  } from "cleave-zen";

export default function useCreditCardInput(validateInput : (e : string) => boolean) {
  const [input, setInput] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [raw, setRaw] = useState<string>('');
  const [isTouched, setIsTouched] =
    useState<boolean>(false);
  const inputIsValid = validateInput(input)
  const inputIsInvalid = !inputIsValid && isTouched

  const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
    const value = formatCreditCard(e.target.value);
    const type = getCreditCardType(e.target.value);
    const raw = unformatCreditCard(e.target.value);
    setInput(value);
    setType(type);
    setRaw(raw);
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
