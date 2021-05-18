import { ThemeContextProvider } from "../context/themeContext";
import PropTypes from "prop-types";
import ClientOnly from "../components/ClientOnly";
import "../node_modules/normalize.css/normalize.css";
import "../public/styles.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

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
