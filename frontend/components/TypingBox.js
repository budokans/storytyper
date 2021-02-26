import { useEffect } from "react";
import classNames from "classnames";

export default function TypingBox(props) {
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

  // Enlarges the textarea as the user types
  // Because a border is applied with the light theme, the height needs to stay at least 2px ahead of the scrollHeight.
  function resizeTextarea() {
    textareaRef.current.style.height = "0px";
    textareaRef.current.style.height =
      theme === "dark"
        ? `${textareaRef.current.scrollHeight + 1}px`
        : `${textareaRef.current.scrollHeight + 2}px`;
  }

  const typingBoxClass = classNames({
    "gameplay-box": true,
    "gameplay-box--input": true,
    "gameplay-box--error": errorPresent,
    "gameplay-box--input--light-theme": theme === "light",
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
        // onPaste={(e) => e.preventDefault()}
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