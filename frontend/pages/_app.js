import { ThemeContextProvider } from "../context/themeContext";
import PropTypes from "prop-types";
import ClientOnly from "../components/ClientOnly";
import "../public/styles.css";

function App({ Component, pageProps }) {
  return (
    <ClientOnly>
      <ThemeContextProvider>
        <Component {...pageProps} />
      </ThemeContextProvider>
    </ClientOnly>
  );
}

App.propTypes = {
  Component: PropTypes.oneOfType([PropTypes.func, PropTypes.element])
    .isRequired,
  pageProps: PropTypes.object,
};

export default App;
