import { useThemeContext } from "../context/themeContext";

export default function Header({ children }) {
  const { theme } = useThemeContext();

  return (
    <header className={`main-header  main-header--${theme}-theme`}>
      <h1 className="main-header__title">Story Typer</h1>

      {children}
    </header>
  );
}
