import { createContext, useContext } from "react";
import useStickyState from "../hooks/useStickyState";
const ThemeContext = createContext();

export function ThemeContextProvider({ children }) {
  const [theme, setTheme] = useStickyState("dark", "userPreferredTheme");

  function toggleTheme() {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  return useContext(ThemeContext);
}
