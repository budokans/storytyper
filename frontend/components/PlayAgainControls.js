import { useThemeContext } from "../context/themeContext";
import Button from "./Button";
import PropTypes from "prop-types";

function PlayAgainControls({
  onRestartClick,
  onPlayAgainClick,
  onChangeStory,
  isRunning,
  gameIsOver,
  storiesAreLoaded,
}) {
  const { theme } = useThemeContext();

  return (
    <>
      <Button
        onClick={isRunning ? onRestartClick : onPlayAgainClick}
        buttonClass="side-panel__btn-controls  btn--pause"
        disabled={!isRunning && !gameIsOver ? true : false}
      >
        {!gameIsOver ? "Restart" : "Repeat Story"}
      </Button>

      <Button
        onClick={onChangeStory}
        buttonClass={`side-panel__btn-controls  btn--go--${theme}-theme`}
        disabled={isRunning || !storiesAreLoaded ? true : false}
      >
        Next Story
      </Button>
    </>
  );
}

PlayAgainControls.propTypes = {
  onRestartClick: PropTypes.func,
  onPlayAgainClick: PropTypes.func,
  onChangeStory: PropTypes.func,
  isRunning: PropTypes.bool.isRequired,
  gameIsOver: PropTypes.bool.isRequired,
  storiesAreLoaded: PropTypes.bool.isRequired,
};

export default PlayAgainControls;
