import { useThemeContext } from "../context/themeContext";
import classNames from "classnames";
import PropTypes from "prop-types";

function GameTimeRemaining({ gameTimeRemaining, timeLeftOver }) {
  const { theme } = useThemeContext();

  const gameTimeClass = classNames({
    "game-time-display": true,
    [`game-time-display--${theme}-theme`]: true,
    "game-time-display--critical":
      gameTimeRemaining < 6 && gameTimeRemaining > 0,
    "game-time-display--inert": gameTimeRemaining === 0 || timeLeftOver,
  });

  return (
    <div className={gameTimeClass}>
      <h3 className="game-time-display__count">{gameTimeRemaining}</h3>
      <h4 className="game-time-display__subtext">seconds left</h4>
    </div>
  );
}

GameTimeRemaining.propTypes = {
  gameTimeRemaining: PropTypes.number.isRequired,
  timeLeftOver: PropTypes.number.isRequired,
};

export default GameTimeRemaining;
