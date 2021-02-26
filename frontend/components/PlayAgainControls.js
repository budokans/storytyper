import { useThemeContext } from "../context/themeContext";
import Button from "./Button";

export default function PlayAgainControls({
  onRestartClick,
  onPlayAgainClick,
  onChangeStory,
  isRunning,
  gameIsOver,
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
        disabled={isRunning ? true : false}
      >
        Next Story
      </Button>
    </>
  );
}
