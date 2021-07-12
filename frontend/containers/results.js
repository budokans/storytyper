import { useThemeContext } from "../context/themeContext";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Results } from "../components/Results";
import { Difficulty } from "../components/Difficulty";
import HighScore from "../components/HighScore";
import Stats from "../components/Stats";
import PlayAgainControls from "../components/PlayAgainControls";
import Button from "../components/Button";

const ResultsContainer = ({
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
}) => {
  const { theme, toggleTheme } = useThemeContext();

  const themeButtonClasses = classNames({
    "side-panel__btn-controls": true,
    "btn--dark": theme === "light",
    "btn--light": theme === "dark",
  });

  return (
    <Results>
      <Results.Section>
        <Results.Header>Difficulty</Results.Header>

        <Difficulty
          level={level}
          gameOverModalClosed={gameOverModalClosed}
          playerShouldLevelUp={playerShouldLevelUp}
          gameIsOver={gameIsOver}
          isRunning={isRunning}
        />
      </Results.Section>

      <Results.Divider />

      <Results.Section>
        <Results.Header>High Score</Results.Header>
        <HighScore
          highScore={highScore}
          wpm={wpm}
          gameOverModalClosed={gameOverModalClosed}
          gameIsOver={gameIsOver}
        />
      </Results.Section>

      <Results.Divider />

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
    </Results>
  );
};

ResultsContainer.propTypes = {
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

export { ResultsContainer };
