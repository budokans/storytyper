import { useThemeContext } from "../context/themeContext";
import classNames from "classnames";

export default function Countdown({ countdown, isRunning }) {
  function countdownDisplayText() {
    if (countdown === 2 && isRunning) return "Ready!";
    else if (countdown === 1) return "Set!";
    else return "Go!";
  }

  const { theme } = useThemeContext();

  const countdownClass = classNames({
    "countdown-text": true,
    [`countdown-text--${theme}-theme`]: countdown >= 1,
    [`countdown-text--go--${theme}-theme`]: countdown === 0 || !isRunning,
    "countdown-text--collapsed": !isRunning,
  });

  return <h3 className={countdownClass}>{countdownDisplayText()}</h3>;
}
