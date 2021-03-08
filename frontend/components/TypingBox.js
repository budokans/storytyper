import { useEffect } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";

function TypingBox(props) {
  const {
    countdown,
    text,
    isRunning,
    textareaRef,
    startGame,
    onTextChange,
    gameIsOver,
    wordCount,
    errorPresent,
    theme,
  } = props;

  // Handles user input text and sets it to state
  function handleTextChange(e) {
    onTextChange(e.target.value);
  }

  // Displays helpful textarea placeholder text depending on the stage in the game
  function placeholderText() {
    if (!isRunning && !gameIsOver) {
      return "Click here or press any key to start!";
    } else if (isRunning && countdown !== 0) {
      return "On your marks!";
    } else if (gameIsOver && wordCount === 0) {
      return "...";
    } else {
      return undefined;
    }
  }

  // Maintains the height 2px above the scrollHeight to prevent a scrollbar showing.
  function resizeTextarea() {
    textareaRef.current.style.height = `${
      textareaRef.current.scrollHeight + 2
    }px`;
  }

  const typingBoxClass = classNames({
    "gameplay-box": true,
    "gameplay-box--input": true,
    "gameplay-box--error": errorPresent,
    [`gameplay-box--input--${theme}-theme`]: true,
  });

  // Prevents scrollbar from appearing if theme is changed after game is over.
  useEffect(() => {
    gameIsOver && resizeTextarea();
  }, [theme]);

  return (
    <>
      <textarea
        className={typingBoxClass}
        placeholder={placeholderText()}
        onClick={startGame}
        onChange={handleTextChange}
        onPaste={(e) => e.preventDefault()}
        value={text}
        ref={textareaRef}
        autoCapitalize="off"
        autoCorrect="off"
        onInput={resizeTextarea}
      ></textarea>

      {isRunning && errorPresent && (
        <h4 className="alert-error">Fix the error!</h4>
      )}
    </>
  );
}

TypingBox.propTypes = {
  countdown: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  isRunning: PropTypes.bool.isRequired,
  textareaRef: PropTypes.object.isRequired,
  startGame: PropTypes.func.isRequired,
  onTextChange: PropTypes.func.isRequired,
  gameIsOver: PropTypes.bool.isRequired,
  wordCount: PropTypes.number.isRequired,
  errorPresent: PropTypes.bool.isRequired,
  theme: PropTypes.string.isRequired,
};

export default TypingBox;
