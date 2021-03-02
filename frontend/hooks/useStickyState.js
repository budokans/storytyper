import { useState, useEffect } from "react";

export default function useStickyState(defaultValue, key) {
  const [value, setValue] = useState(() => {
    // Get the data from local storage and return it if it exists, otherwise the defaultValue
    const stickyValue = window.localStorage.getItem(key);
    return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
  });

  // Update local storage when state changes
  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
