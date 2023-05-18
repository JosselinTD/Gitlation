import { useState } from "react";

export default function useLocalStorage(
  key: string,
  defaultValue: string
): [string, (value: string) => void] {
  let value = localStorage.getItem(key);
  if (!value) {
    localStorage.setItem(key, defaultValue);
    value = localStorage.getItem(key);
  }
  const [state, setState] = useState(value as string);

  function setValue(value: string) {
    localStorage.setItem(key, value);
    setState(value);
  }

  return [state, setValue];
}
