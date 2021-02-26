import { useThemeContext } from "../context/themeContext";
import classNames from "classnames";

export default function GameTimeRemaining({ gameTimeRemaining, timeLeftOver }) {
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
