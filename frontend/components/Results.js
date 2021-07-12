import { useThemeContext } from "../context/themeContext";
import classNames from "classnames";

const Results = ({ children }) => {
  const { theme } = useThemeContext();

  const sidePanelClasses = classNames({
    "side-panel": true,
    "shiny-border": theme === "dark",
    "side-panel--light-theme": theme === "light",
  });

  return <section className={sidePanelClasses}>{children}</section>;
};

Results.Section = ({ children }) => {
  return <div>{children}</div>;
};

Results.Divider = () => {
  return <hr />;
};

Results.Header = ({ children }) => {
  const { theme } = useThemeContext();
  return (
    <h5 className={`side-panel__header  side-panel__header--${theme}-theme`}>
      {children}
    </h5>
  );
};

export { Results };
