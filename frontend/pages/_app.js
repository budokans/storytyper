import { ThemeContextProvider } from "../context/themeContext";
import "../styles.css";

export default function App({ Component, pageProps }) {
  return (
    <ThemeContextProvider>
      <Component {...pageProps} />
    </ThemeContextProvider>
  );
}
