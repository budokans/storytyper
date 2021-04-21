import React, { useEffect } from "react";
import classNames from "classnames";
import StoryBox from "../components/StoryBox";
import CountdownDisplay from "../components/CountdownDisplay";
import TypingBox from "../components/TypingBox";
import GameTimeDisplay from "../components/GameTimeDisplay";
import Modal from "../components/Modal";
import ResultsPanel from "../components/ResultsPanel";
// For development
import difficulties from "../difficulties.json";
// Hooks & Context
import useStoryTyper from "../hooks/useStoryTyper";
import { useThemeContext } from "../context/themeContext";

export default function Home() {
  const [
    currentStory,
    gameIsOver,
    countdown,
    text,
    handleTextChange,
    isRunning,
    textareaRef,
    startGame,
    wordCount,
    errorPresent,
    gameTimeRemaining,
    timeLeftOver,
    handleNextStoryClick,
    handleRestartClick,
    handlePlayAgainClick,
    highScore,
    wpm,
    cpm,
    efficiency,
    inefficientKeyStrokesCount,
    level,
    gameOverModalClosed,
    playerShouldLevelUp,
    handleToggleModal,
    storiesAreLoaded,
  ] = useStoryTyper();

  const { theme } = useThemeContext();

  // Set body background color once the document object has loaded
  useEffect(() => {
    document.body.style.backgroundColor =
      theme === "light" ? "#faf0e6" : "black";
  }, [theme]);

  const gameOverModalClass = classNames({
    "modal__body--bg-transparent": true,
    "modal__body--alert": true,
    ["shiny-border--success"]: gameTimeRemaining,
    ["shiny-border--fail"]: !gameTimeRemaining,
  });

  return (
    <div className="game-container">
      <section className="gameplay-container">
        <StoryBox currentStory={currentStory} gameIsOver={gameIsOver} />

        <TypingBox
          countdown={countdown}
          text={text}
          onTextChange={handleTextChange}
          isRunning={isRunning}
          textareaRef={textareaRef}
          startGame={startGame}
          gameIsOver={gameIsOver}
          wordCount={wordCount}
          errorPresent={errorPresent}
          theme={theme}
        />

        <CountdownDisplay countdown={countdown} isRunning={isRunning} />

        <GameTimeDisplay
          gameTimeRemaining={gameTimeRemaining}
          timeLeftOver={timeLeftOver}
        />
      </section>

      <ResultsPanel
        onChangeStory={handleNextStoryClick}
        onRestartClick={handleRestartClick}
        onPlayAgainClick={handlePlayAgainClick}
        highScore={highScore}
        wpm={wpm}
        cpm={cpm}
        efficiency={efficiency}
        inefficientKeyStrokesCount={inefficientKeyStrokesCount}
        isRunning={isRunning}
        gameIsOver={gameIsOver}
        level={level}
        gameOverModalClosed={gameOverModalClosed}
        playerShouldLevelUp={playerShouldLevelUp}
        storiesAreLoaded={storiesAreLoaded}
      />

      <Modal
        onToggleModal={handleToggleModal}
        modalIsShowing={gameIsOver && !gameOverModalClosed ? true : false}
        modalBodyIsTransparent={true}
        modalBodyClass={gameOverModalClass}
      >
        <header
          className={`modal__header--xl  span-grid-width  ${
            timeLeftOver ? "rich" : ""
          }`}
        >
          {timeLeftOver ? "Congratulations" : "Bad luck"}
        </header>

        <h2 className="modal__subheader  span-grid-width">
          {timeLeftOver
            ? `You beat the clock by ${timeLeftOver} seconds!`
            : "You were beaten by the clock!"}
        </h2>

        {gameTimeRemaining === 0 && wpm > highScore && (
          <h2 className="modal__subheader  span-grid-width">But...</h2>
        )}

        <h2
          className={`modal__subheader  span-grid-width  ${
            wpm > highScore ? "rich" : ""
          }`}
        >
          {wpm > highScore
            ? `*** New High Score: ${wpm} wpm ***`
            : `*** Speed: ${wpm} wpm ***`}
        </h2>

        {playerShouldLevelUp && (
          <h2 className="modal__subheader  span-grid-width  rich">
            *** You leveled up to{" "}
            <strong className={difficulties[level + 1].class}>
              {difficulties[level + 1].name}
            </strong>{" "}
            ***
          </h2>
        )}
      </Modal>
    </div>
  );
}
