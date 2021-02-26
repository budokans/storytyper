import classNames from "classnames";
import { useThemeContext } from "../context/themeContext";

export default function HighScore({
  highScore,
  wpm,
  gameOverModalClosed,
  gameIsOver,
}) {
  let highScoreAlreadyAchieved =
    highScore !== 0 || wpm > highScore ? true : false;

  // Gets the text to display as high score. If the player hasn't yet set a high score, the text will read TBC. Otherwise it will be updated if a new score is set, or remain unchanged if not.
  function getHighScoreDisplay() {
    if (highScoreAlreadyAchieved) {
      return wpm > highScore ? `${wpm} wpm` : `${highScore} wpm`;
    }
    return "TBC";
  }

  const highScoreDisplayClass = classNames({
    "side-panel__subheader": true,
    "side-panel__subheader--score": true,
    hidden: gameIsOver && !gameOverModalClosed,
  });

  const { theme } = useThemeContext();

  return (
    <div>
      <h5 className={`side-panel__header  side-panel__header--${theme}-theme`}>
        High Score
      </h5>
      <h4 className={highScoreDisplayClass}>
        {getHighScoreDisplay()}
        {gameIsOver && wpm > highScore && (
          <i
            className={`ri-arrow-up-fill ri-arrow-up-fill--${theme}-theme`}
          ></i>
        )}
        {gameIsOver && wpm <= highScore && (
          <i className="ri-subtract-line  failure"></i>
        )}
      </h4>
      <hr />
    </div>
  );
}
