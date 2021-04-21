import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import parse from "html-react-parser";
import classNames from "classnames";
import useModalToggler from "../hooks/useModalToggler";
import Button from "./Button";
import Modal from "./Modal";

export default function StoryBox({ currentStory, gameIsOver }) {
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

  const formattingButtonClass = classNames({
    btn: true,
    "gameplay-box--story__btn": true,
    "gameplay-box--story__btn--clicked": formattedIsShowing,
  });

  function addClassToBio() {
    const classAdded = currentStory.bio.replace(/<a/g, '<a class="out-link"');
    const finalBioHTML = /opener/.test(classAdded)
      ? classAdded.replace(/opener/, "referrer")
      : classAdded.replace(/<a/, '<a rel="noreferrer"');
    return finalBioHTML;
  }

  return (
    <>
      {gameIsOver && (
        <header className="gameplay-box--story__header">
          <strong>{currentStory.title}</strong> by {currentStory.author}
        </header>
      )}

      {
        // Show text with original formatting if the Original Formatting button has been clicked, otherwise show the condensed version for gameplay.
        !formattedIsShowing ? (
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
            <a
              className="out-link"
              href={currentStory.url}
              target="_blank"
              rel="noreferrer"
            >
              fiftywordstories.com
            </a>
          </p>
        </>
      )}

      <Modal
        modalIsShowing={modalIsShowing}
        onToggleModal={handleToggleModal}
        modalBodyClass="modal__body--story"
      >
        <header className="modal__header">
          <h2>{currentStory.author}</h2>
        </header>
        <p className="span-grid-width">
          {currentStory.bio && parse(addClassToBio())}
        </p>
      </Modal>
    </>
  );
}

StoryBox.propTypes = {
  currentStory: PropTypes.object,
  gameIsOver: PropTypes.bool.isRequired,
};
