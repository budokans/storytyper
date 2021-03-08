import { useThemeContext } from "../context/themeContext";
import useModalToggler from "../hooks/useModalToggler";
import classNames from "classnames";
import PropTypes from "prop-types";
import Button from "./Button";
import Modal from "./Modal";

function Stats({
  wpm,
  cpm,
  inefficientKeyStrokesCount,
  efficiency,
  gameOverModalClosed,
}) {
  const [modalIsShowing, handleToggleModal] = useModalToggler();
  const { theme } = useThemeContext();

  const divClass = classNames({
    "side-panel__box": true,
    visible: gameOverModalClosed,
  });

  return (
    <>
      <div className={divClass}>
        <h5
          className={`side-panel__header  side-panel__header--${theme}-theme`}
        >
          Stats
        </h5>
        <ul className={`side-panel__list  side-panel__list--${theme}-theme`}>
          <li>WPM: {wpm}</li>
          <li>
            CPM: {cpm}
            <Button
              onClick={handleToggleModal}
              buttonClass={`side-panel__btn-modal  side-panel__btn-modal--${theme}-theme`}
            >
              i
            </Button>
          </li>
          <li>Bad Keystrokes: {inefficientKeyStrokesCount}</li>
          <li>Efficiency: {efficiency ? `${efficiency}%` : "n/a"}</li>
        </ul>
      </div>
      <Modal
        modalIsShowing={modalIsShowing}
        onToggleModal={handleToggleModal}
        modalBodyClass={`${theme === "dark" ? "modal__body--bg-dark" : ""}`}
      >
        <p>Characters per minute</p>
      </Modal>
    </>
  );
}

Stats.propTypes = {
  wpm: PropTypes.number.isRequired,
  cpm: PropTypes.number.isRequired,
  inefficientKeyStrokesCount: PropTypes.number.isRequired,
  efficiency: PropTypes.number.isRequired,
  gameOverModalClosed: PropTypes.bool.isRequired,
};

export default Stats;
