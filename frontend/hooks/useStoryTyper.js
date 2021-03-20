import { useState, useEffect, useRef } from "react";
import axios from "axios";
import difficulties from "../difficulties.json";
import storiesData from "../public/storiesData.json";

export default function useStoryTyper() {
  const [unreadStories, setUnreadStories] = useState([]);
  const [currentStory, setCurrentStory] = useState({});
  const [level, setLevel] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [text, setText] = useState("");
  const [countdown, setCountdown] = useState(2);
  const [gameTimeRemaining, setGameTimeRemaining] = useState(
    difficulties[level].seconds
  );
  const [highScore, setHighScore] = useState(0);
  const textareaRef = useRef();
  const [errorPresent, setErrorPresent] = useState(false);
  const [inefficientKeyStrokesCount, setInefficientKeyStrokesCount] = useState(
    0
  );
  const [timeLeftOver, setTimeLeftOver] = useState(0);
  const gameIsOver = gameTimeRemaining === 0 || timeLeftOver > 0 ? true : false;
  const [gameOverModalClosed, setGameOverModalClosed] = useState(false);
  const playerShouldLevelUp =
    timeLeftOver && level !== difficulties.length - 1 ? true : false;
  const [batchRequest, setBatchRequest] = useState(0);
  const [storiesAreLoaded, setStoriesAreLoaded] = useState(false);
  const [dbCount, setDbCount] = useState(0);

  async function getDbData(url) {
    const { data } = await axios.get(url);
    return data;
  }

  // Gets the stories array from db and saves it to state on initial render
  useEffect(() => {
    getDbData(`https://storytyper.herokuapp.com/data?batch=${batchRequest}`)
      .then((data) => {
        setUnreadStories(data);
        setBatchRequest(batchRequest + 1);
        setStoriesAreLoaded(true);
        console.log("Success: stories received from db");
      })
      .catch((err) => {
        setUnreadStories(storiesData);
        setStoriesAreLoaded(true);
        console.log(err);
        console.log("Warning: db unavailable - local stories data used");
      });
  }, []);

  function getDbCount() {
    getDbData("https://storytyper.herokuapp.com/count")
      .then((data) => {
        setDbCount(data.count);
        console.log("Success: count received from db");
      })
      .catch((err) => {
        console.log(err);
        console.log("Can't find the dbCount");
      });
  }

  // Find the number of stories available in the database and save to state.
  useEffect(() => {
    getDbCount();
  }, []);

  // Set a story picked randomly unreadStories to currentStory
  function getFreshCurrentStory() {
    const currentStoryIdx = Math.floor(Math.random() * unreadStories.length);
    setCurrentStory(unreadStories[currentStoryIdx]);
  }

  useEffect(() => {
    getFreshCurrentStory();
  }, [storiesAreLoaded]);

  // Remove the completed story from unreadStories
  function updateUnreadStories() {
    const updatedUnreadStories = unreadStories.filter(
      (story) => story !== currentStory
    );
    setUnreadStories(updatedUnreadStories);
  }

  // If unreadStories is getting low, more stories will be requested from the server or, if it fails, the local storiesData. If there are no more documents in the db, go back to requesting the first batch.
  useEffect(() => {
    if (unreadStories.length === 5) {
      getDbData(`https://storytyper.herokuapp.com/data?batch=${batchRequest}`)
        .then((data) => {
          setUnreadStories(unreadStories.concat(data));
          // If initial render getDbCount call was unsuccessful, call it again.
          if (dbCount === 0) {
            getDbCount();
          }
          // If the dbCount has been set and the next request would request data that doesn't exist in the db, reset batchRequest to 0.
          if ((batchRequest + 1) * 10 > dbCount && dbCount !== 0) {
            setBatchRequest(0);
          } else {
            setBatchRequest(batchRequest + 1);
          }
        })
        .catch((err) => {
          console.log(err);
          setUnreadStories(storiesData);
        });
    }
  }, [unreadStories]);

  function startGame() {
    !isRunning && !gameIsOver && currentStory && setIsRunning(true);
  }

  // Pass 'start on keypress' handler to onkeypress method when document has loaded
  useEffect(() => {
    document.onkeypress = () => {
      !isRunning && !gameIsOver && startGame();
    };
  }, [isRunning, gameIsOver]);

  // Starts the countdown and keeps the textarea disabled until it reaches 0
  useEffect(() => {
    let countdownTimeout;
    if (isRunning && countdown > 0) {
      textareaRef.current.disabled = true;
      countdownTimeout = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    }
    return () => clearTimeout(countdownTimeout);
  }, [isRunning, countdown]);

  // gameTimeRemaining Timer
  useEffect(() => {
    let timeRemainingTimeout;
    if (countdown === 0 && isRunning) {
      textareaRef.current.disabled = false;
      textareaRef.current.focus();
      timeRemainingTimeout = setTimeout(() => {
        setGameTimeRemaining(gameTimeRemaining - 1);
      }, 1000);
    }
    return () => clearTimeout(timeRemainingTimeout);
  }, [isRunning, countdown, gameTimeRemaining]);

  // Stops game when time runs out
  useEffect(() => {
    if (gameTimeRemaining === 0) {
      textareaRef.current.disabled = true;
      setIsRunning(false);
    }
  });

  // Stops game when the input matches the story
  useEffect(() => {
    if (currentStory) {
      if (text === currentStory.storyText) {
        textareaRef.current.disabled = true;
        setIsRunning(false);
        setTimeLeftOver(gameTimeRemaining);
      }
    }
  }, [currentStory, text]);

  // Saves user input text to state
  function handleTextChange(text) {
    setText(text);
  }

  // Checks for and alerts for errors as user types
  useEffect(() => {
    if (isRunning) {
      const typedSoFar = currentStory.storyText.slice(0, text.length);
      if (typedSoFar !== text) {
        setErrorPresent(true);
        setInefficientKeyStrokesCount(inefficientKeyStrokesCount + 1);
      }
      if (typedSoFar === text) {
        setErrorPresent(false);
      }
    }
  }, [text]);

  // Separates any trailing erroneous characters from the correctly typed input
  function removeBadCharacters() {
    for (let i = 0; i < currentStory.storyText.length; i++) {
      if (currentStory.storyText.charAt(i) !== text.charAt(i)) {
        return text.slice(0, i);
      }
    }
  }

  // Removes any incompletely typed words from the end of the input text.
  function getOnlyCompleteWords(text) {
    const finalChar = text.charAt(text.length - 1);
    const nextChar = currentStory.storyText.charAt(text.length);
    const lastWhiteSpace = text.lastIndexOf(" ");
    const atLeastOneSpace = text.search(/\s/);
    const onlyCompletedWords = text.slice(0, lastWhiteSpace);

    if (finalChar !== " " && nextChar !== " " && atLeastOneSpace > -1) {
      return onlyCompletedWords;
    } else if (finalChar === " " || nextChar === " ") {
      return text;
    } else {
      return 0;
    }
  }

  // Trims the processed string, splits into an array and counts the length
  function trimAndCount(text) {
    return text
      ? text
          .trim()
          .split(" ")
          .filter((word) => word !== "" && word !== "-").length
      : 0;
  }

  // Calculates the final word count in various way depending on the state of the user input
  const calculateWordCount = () => {
    if (text === currentStory.storyText) {
      return trimAndCount(text);
    } else if (errorPresent) {
      const errorFreeText = removeBadCharacters();
      const onlyCompleteWords = getOnlyCompleteWords(errorFreeText);
      return trimAndCount(onlyCompleteWords);
    } else {
      const partialWordsRemoved = getOnlyCompleteWords(text);
      return trimAndCount(partialWordsRemoved);
    }
  };

  const wordCount = gameIsOver ? calculateWordCount() : 0;

  // Calculates WPM
  const wpm = Math.floor(
    wordCount / ((difficulties[level].seconds - timeLeftOver) / 60)
  );

  // Calculates number of characters for CPM and Efficiency measures
  // If no error is present, text.length
  function getCharCount() {
    return errorPresent ? removeBadCharacters().length : text.length;
  }
  const charCount = gameIsOver && getCharCount();

  // Calculates CPM
  const cpm = Math.floor(
    charCount / ((difficulties[level].seconds - timeLeftOver) / 60)
  );

  // Calculates efficiency
  const efficiency =
    cpm > 0
      ? Math.round(100 * (charCount / (charCount + inefficientKeyStrokesCount)))
      : 0;

  // Functionality that all of the PlayButtons need for their various reset types. Note: resets height of textarea to the maximum without scrollbar.
  function basicReset() {
    setText("");
    setCountdown(2);
    setErrorPresent(false);
    setInefficientKeyStrokesCount(0);
    setGameOverModalClosed(false);
    textareaRef.current.style.height = "5.64em";
  }

  // Resets the game if the player decides to click Reset in the middle of a game.
  function handleRestartClick() {
    basicReset();
    setIsRunning(false);
    setTimeLeftOver(0);
    setGameTimeRemaining(difficulties[level].seconds);
  }

  // Resets the game so the user can re-attempt the same story
  // High score will be set if it has been achieved
  function handlePlayAgainClick() {
    basicReset();
    wpm > highScore && setHighScore(wpm);
    playerShouldLevelUp && setLevel(level + 1);
    playerShouldLevelUp
      ? setGameTimeRemaining(difficulties[level + 1].seconds)
      : setGameTimeRemaining(difficulties[level].seconds);
    setTimeLeftOver(0);
  }

  // Starts a new game with a new story
  // High score will be set if it has been achieved
  function handleNextStoryClick() {
    handlePlayAgainClick();
    updateUnreadStories();
    getFreshCurrentStory();
  }

  // Handles clicking of the close button inside the Modal
  function handleToggleModal() {
    setGameOverModalClosed(true);
  }

  return [
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
  ];
}
