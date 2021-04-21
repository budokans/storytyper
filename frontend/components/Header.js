import { useThemeContext } from "../context/themeContext";

export default function Header() {
  const { theme } = useThemeContext();

  return (
    <header className={`main-header  main-header--${theme}-theme`}>
      <h1 className="main-header__title">Story Typer</h1>

      <p className="main-header__subtext">
        Improve your typing speed while reading cool 50-word stories!
      </p>

      <p className="main-header__subtext">
        Beat the clock to reach the next difficulty level!
      </p>
    </header>
  );
}
