import { useThemeContext } from "../context/themeContext";
import PropTypes from "prop-types";
import classNames from "classnames";
import Difficulty from "./Difficulty";
import HighScore from "./HighScore";
import Stats from "./Stats";
import PlayAgainControls from "./PlayAgainControls";
import Button from "./Button";

function ResultsPanel(props) {
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
    storiesAreLoaded,
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
        isRunning={isRunning}
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
        storiesAreLoaded={storiesAreLoaded}
      />

      <Button onClick={toggleTheme} buttonClass={themeButtonClasses}>
        {`${theme === "dark" ? "Light" : "Dark"} Theme`}
      </Button>
    </section>
  );
}

ResultsPanel.propTypes = {
  onChangeStory: PropTypes.func,
  onRestartClick: PropTypes.func,
  onPlayAgainClick: PropTypes.func,
  highScore: PropTypes.number.isRequired,
  wpm: PropTypes.number.isRequired,
  cpm: PropTypes.number.isRequired,
  inefficientKeyStrokesCount: PropTypes.number.isRequired,
  isRunning: PropTypes.bool.isRequired,
  gameIsOver: PropTypes.bool.isRequired,
  efficiency: PropTypes.number.isRequired,
  level: PropTypes.number.isRequired,
  gameOverModalClosed: PropTypes.bool.isRequired,
  playerShouldLevelUp: PropTypes.bool.isRequired,
  storiesAreLoaded: PropTypes.bool.isRequired,
};

export default ResultsPanel;
