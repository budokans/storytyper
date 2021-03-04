import { ThemeContextProvider } from "../context/themeContext";
import ClientOnly from "../components/ClientOnly";
import "../public/styles.css";

export default function App({ Component, pageProps }) {
  return (
    <ClientOnly>
      <ThemeContextProvider>
        <Component {...pageProps} />
      </ThemeContextProvider>
    </ClientOnly>
  );
}
