import { useThemeContext } from "../context/themeContext";
import classNames from "classnames";
import Difficulty from "./Difficulty";
import HighScore from "./HighScore";
import Stats from "./Stats";
import PlayAgainControls from "./PlayAgainControls";
import Button from "./Button";

export default function ResultsPanel(props) {
  const {
    onChangeStory,
    onRestartClick,
    onPlayAgainClick,
    highScore,
    wpm,
    cpm,
    inefficientKeyStrokesCount,
    isRunning,
    gameIsOver,
    efficiency,
    level,
    gameOverModalClosed,
    playerShouldLevelUp,
  } = props;

  const { theme, toggleTheme } = useThemeContext();

  const sidePanelClasses = classNames({
    "side-panel": true,
    "shiny-border": theme === "dark",
    "side-panel--light-theme": theme === "light",
  });

  const themeButtonClasses = classNames({
    "side-panel__btn-controls": true,
    "btn--dark": theme === "light",
    "btn--light": theme === "dark",
  });

  return (
    <section className={sidePanelClasses}>
      <Difficulty
        level={level}
        gameOverModalClosed={gameOverModalClosed}
        playerShouldLevelUp={playerShouldLevelUp}
        gameIsOver={gameIsOver}
      />

      <HighScore
        highScore={highScore}
        wpm={wpm}
        gameOverModalClosed={gameOverModalClosed}
        gameIsOver={gameIsOver}
      />

      <Stats
        wpm={wpm}
        cpm={cpm}
        inefficientKeyStrokesCount={inefficientKeyStrokesCount}
        efficiency={efficiency}
        gameOverModalClosed={gameOverModalClosed}
      />

      <PlayAgainControls
        onRestartClick={onRestartClick}
        onPlayAgainClick={onPlayAgainClick}
        onChangeStory={onChangeStory}
        isRunning={isRunning}
        gameIsOver={gameIsOver}
      />

      <Button onClick={toggleTheme} buttonClass={themeButtonClasses}>
        {`${theme === "dark" ? "Light" : "Dark"} Theme`}
      </Button>
    </section>
  );
}
