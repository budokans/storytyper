import useModalToggler from "../hooks/useModalToggler";
import classNames from "classnames";
import PropTypes from "prop-types";
import { useThemeContext } from "../context/themeContext";
import Button from "./Button";
import Modal from "./Modal";
import difficulties from "../difficulties.json";

function Difficulty(props) {
  const { level, gameOverModalClosed, playerShouldLevelUp, gameIsOver } = props;
  const [modalIsShowing, handleToggleModal] = useModalToggler();

  // Displays the difficulty level list items
  const difficultiesList = difficulties.map((level, idx) => {
    return (
      <li key={idx}>
        <span className={level.class}>{level.name}:</span> {level.speed} WPM
      </li>
    );
  });

  const { theme } = useThemeContext();

  const difficultyNameHeaderClass = classNames({
    "side-panel__subheader": true,
    hidden: gameIsOver && !gameOverModalClosed,
    [`side-panel__subheader--${theme}-theme`]: level < 2,
    [`${playerShouldLevelUp && difficulties[level + 1].class}`]: true,
    [`${!playerShouldLevelUp && difficulties[level].class}`]: true,
  });

  return (
    <div>
      <h5 className={`side-panel__header  side-panel__header--${theme}-theme`}>
        Difficulty
      </h5>
      <Button
        onClick={handleToggleModal}
        buttonClass={`side-panel__btn-modal  side-panel__btn-modal--${theme}-theme`}
      >
        i
      </Button>

      <h4 className={difficultyNameHeaderClass}>
        {playerShouldLevelUp ? (
          <>
            {difficulties[level + 1].name}
            <i
              className={`ri-arrow-up-fill ri-arrow-up-fill--${theme}-theme`}
            ></i>
          </>
        ) : (
          difficulties[level].name
        )}

        {gameIsOver && !playerShouldLevelUp && (
          <i className="ri-subtract-line  failure"></i>
        )}
      </h4>

      <hr />

      <Modal
        modalIsShowing={modalIsShowing}
        onToggleModal={handleToggleModal}
        modalBodyClass={`${theme === "dark" ? "modal__body--bg-dark" : ""}`}
      >
        <header className="modal__header  modal__header--align-left">
          <h2>Difficulty Levels</h2>
        </header>
        <ul className="modal__list">{difficultiesList}</ul>
      </Modal>
    </div>
  );
}

Difficulty.propTypes = {
  level: PropTypes.number.isRequired,
  gameOverModalClosed: PropTypes.bool.isRequired,
  playerShouldLevelUp: PropTypes.bool.isRequired,
  gameIsOver: PropTypes.bool.isRequired,
};

export default Difficulty;
