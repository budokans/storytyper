import { useEffect } from "react";
import classNames from "classnames";
import Head from "next/head";
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

  ("modal__body--bg-transparent  modal__body--alert  shiny-border");

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Speed Typer v1.0</title>
        <link
          href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css"
          rel="stylesheet"
        />
      </Head>
      <header className={`main-header  main-header--${theme}-theme`}>
        <h1 className="main-header__title">Story Typer</h1>

        <p className="main-header__subtext">
          Improve your typing speed while reading cool 50-word stories!
        </p>

        <p className="main-header__subtext">
          Beat the clock to reach the next difficulty level!
        </p>
      </header>

      <div className="game-container">
        <section className="gameplay-container">
          {currentStory ? (
            <StoryBox currentStory={currentStory} gameIsOver={gameIsOver} />
          ) : (
            <h2 className="gameplay-box--story__message">Loading Stories...</h2>
          )}

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
    </>
  );
}
