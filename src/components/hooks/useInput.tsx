import {useState, ChangeEvent} from 'react'

export default function useInput(validateInput : (e : string) => boolean) {
  const [input, setInput] = useState<string>('');
  const [isTouched, setIsTouched] =
    useState<boolean>(false);
  const inputIsValid = validateInput(input)
  const inputIsInvalid = !inputIsValid && isTouched

  const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const inputBlurHandler = () => {
    setIsTouched(true)
  }

  return {
    input,
    inputIsValid,
    inputIsInvalid,
    inputChangeHandler,
    inputBlurHandler,
    setInput,
    setIsTouched
  }
}
