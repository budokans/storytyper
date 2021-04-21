import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import Loader from "react-loader-spinner";
import { useThemeContext } from "../context/themeContext";
import StoryBox from "../components/StoryBox";

export default function StoryBoxContainer({ currentStory, gameIsOver }) {
  const { theme } = useThemeContext();

  const wrapperClass = classNames({
    "gameplay-box": true,
    "gameplay-box--story": true,
    "gameplay-box--expanded": gameIsOver,
    [`gameplay-box--story--${theme}-theme`]: true,
  });

  return (
    <div className={wrapperClass}>
      {!currentStory ? (
        <Loader
          type="Circles"
          color="#00FF00"
          height={80}
          width={80}
          timeout={3000}
          className="gameplay-box--story__spinner"
        />
      ) : (
        <StoryBox currentStory={currentStory} gameIsOver={gameIsOver} />
      )}
    </div>
  );
}

StoryBoxContainer.propTypes = {
  currentStory: PropTypes.object,
  gameIsOver: PropTypes.bool.isRequired,
};
