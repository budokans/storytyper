import { useState, useEffect } from "react";
import { useThemeContext } from "../context/themeContext";
import useModalToggler from "../hooks/useModalToggler";
import PropTypes from "prop-types";
import parse from "html-react-parser";
import classNames from "classnames";
import Button from "./Button";
import Modal from "./Modal";

function StoryBox({ currentStory, gameIsOver }) {
  const [modalIsShowing, handleToggleModal] = useModalToggler();
  const [formattedIsShowing, setFormattedIsShowing] = useState(false);

  // Toggles formatted story text
  function toggleFormatting() {
    setFormattedIsShowing(!formattedIsShowing);
  }

  // Ensure that formatted version is not shown when a new story is loaded.
  useEffect(() => {
    setFormattedIsShowing(false);
  }, [currentStory]);

  const { theme } = useThemeContext();

  const wrapperClass = classNames({
    "gameplay-box": true,
    "gameplay-box--story": true,
    "gameplay-box--expanded": gameIsOver,
    [`gameplay-box--story--${theme}-theme`]: true,
  });

  const formattingButtonClass = classNames({
    btn: true,
    "gameplay-box--story__btn": true,
    "gameplay-box--story__btn--clicked": formattedIsShowing,
  });

  return (
    <div className={wrapperClass}>
      {currentStory && gameIsOver && (
        <header className="gameplay-box--story__header">
          <strong>{currentStory.title}</strong> by {currentStory.author}
        </header>
      )}

      {
        // Show text with original formatting if the Original Formatting button has been clicked, otherwise show the condensed version for gameplay.
        !currentStory ? (
          <h2 className="gameplay-box--story__message">Loading Stories...</h2>
        ) : !formattedIsShowing ? (
          <p className="gameplay-box--story__text">{currentStory.storyText}</p>
        ) : (
          <div className="gameplay-box--story__text">
            {parse(currentStory.storyHTML)}
          </div>
        )
      }

      {gameIsOver && (
        <>
          <Button
            buttonClass={formattingButtonClass}
            onClick={toggleFormatting}
          >
            Original Formatting
          </Button>

          <Button
            onClick={handleToggleModal}
            buttonClass={"btn  gameplay-box--story__btn"}
          >
            Author Bio
          </Button>

          <p className="gameplay-box--story__attribution  span-grid-width  grid-centered  ">
            Story originally published on{" "}
            <a className="out-link" href={currentStory.url} target="_blank">
              50-Word Stories.
            </a>
          </p>
        </>
      )}

      {currentStory && (
        <Modal
          modalIsShowing={modalIsShowing}
          onToggleModal={handleToggleModal}
          modalBodyClass="modal__body--story"
        >
          <header className="modal__header">
            <h2>{currentStory.author}</h2>
          </header>
          <p className="span-grid-width">
            {currentStory.bio && parse(currentStory.bio)}
          </p>
        </Modal>
      )}
    </div>
  );
}

StoryBox.propTypes = {
  currentStory: PropTypes.object.isRequired,
  gameIsOver: PropTypes.bool.isRequired,
};

export default StoryBox;
