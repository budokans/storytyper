import classNames from "classnames";
import { useThemeContext } from "../context/themeContext";
import PropTypes from "prop-types";

function HighScore({ highScore, wpm, gameOverModalClosed, gameIsOver }) {
  let highScoreAlreadyAchieved =
    highScore !== 0 || wpm > highScore ? true : false;

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

HighScore.propTypes = {
  highScore: PropTypes.number.isRequired,
  wpm: PropTypes.number.isRequired,
  gameOverModalClosed: PropTypes.bool.isRequired,
  gameIsOver: PropTypes.bool.isRequired,
};

export default HighScore;
