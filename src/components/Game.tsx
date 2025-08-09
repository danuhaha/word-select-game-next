'use client';

import React, { useState, useEffect, useCallback } from 'react';
import WordTable from './WordTable';
import { getRandomRussianWord, prepareRussianWord, getValidRussianWords, isRussianWordValid, getRussianWords } from '@/utils/russianDictionary';
import { Modal, useModal } from './Modal';
import { GameOverModal } from './GameOverModal';
import ControlButtons from './ControlButtons';
import PlayButton from './PlayButton';
import Timer from './Timer';
import LetterButtons from './LetterButtons';
import { Popup } from './Popup';
import { usePopup } from './usePopup';

interface GameProps {
  wordLength: number;
  getData: (validWords: string[]) => void;
  setScore: (score: number) => void;
  setMaxPossibleScore: (maxScore: number) => void;
  setInitialWord: (word: string) => void;
}

const Game: React.FC<GameProps> = ({ getData, setScore, setMaxPossibleScore, setInitialWord }) => {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [jumbledWord, setJumbledWord] = useState<string[]>([]);
  const [validWords, setValidWords] = useState<Set<string>>(new Set());
  const [usedWords, setUsedWords] = useState<Set<string>>(new Set());
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [letterCounts, setLetterCounts] = useState<Record<string, number>>({});
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [, setButtonResetTrigger] = useState<number>(0);
  const [, setMaxPossibleScoreState] = useState<number>(0);
  const [gameEnded, setGameEnded] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [dialogProps, showModal] = useModal();
  const [popupContent, showPopup] = usePopup();

  const prepareWord = useCallback((wordStr: string, callback: (prepared: string[]) => void) => {
    wordStr = wordStr.toLowerCase();
    const prepared = prepareRussianWord(wordStr);
    const word = prepared.split('');

    const counts: Record<string, number> = {};
    for (let i = 0; i < wordStr.length; i++) {
      const letter = wordStr[i];
      counts[letter] = (counts[letter] || 0) + 1;
    }

    setJumbledWord(word);
    setLetterCounts(counts);
    callback(word);
  }, []);

  const calculateScore = useCallback((word: string): number => {
    const length = word.length;
    if (length === 4) return 1;
    return length; // 5+ letters: 1 point per letter
  }, []);

  const calculateMaxPossibleScore = useCallback(
    (words: Set<string>): number => {
      let totalScore = 0;
      words.forEach((word) => {
        if (word.length >= 4) {
          // Only count words 4+ letters long
          totalScore += calculateScore(word);
        }
      });
      return totalScore;
    },
    [calculateScore]
  );

  const selectWord = useCallback(
    (minLength: number, minValidWords: number = 500) => {
      const allWords = getRussianWords();
      // Filter out words with dashes and apply minimum length requirement
      const filteredWords = allWords.filter((word: string) => word.length >= minLength && !word.includes('-'));
      // Shuffle filteredWords for randomness
      for (let i = filteredWords.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [filteredWords[i], filteredWords[j]] = [filteredWords[j], filteredWords[i]];
      }
      let selected = null;
      let valid = new Set<string>();
      for (const word of filteredWords) {
        const possibleWords = getValidRussianWords(word);
        // Exclude the original word from the count
        const possibleCount = Array.from(possibleWords).filter((w: string) => w !== word.toLowerCase()).length;
        if (possibleCount >= minValidWords) {
          selected = word;
          valid = possibleWords as Set<string>;
          break;
        }
      }
      // Fallback: just pick a random word if none found
      if (!selected) {
        selected = getRandomRussianWord(minLength);
        valid = getValidRussianWords(selected) as Set<string>;
      }
      console.log('amount of words', valid.size, 'max score', calculateMaxPossibleScore(valid));
      setSelectedWord(selected);
      setInitialWord(selected); // Pass the word to parent component
      prepareWord(selected, () => {
        setValidWords(valid);
        const maxScore = calculateMaxPossibleScore(valid);
        setMaxPossibleScore(maxScore);
        setMaxPossibleScoreState(maxScore); // Pass to parent component
        getData(Array.from(valid) as string[]);
      });
    },
    [calculateMaxPossibleScore, getData, setMaxPossibleScore, prepareWord, setInitialWord]
  );

  useEffect(() => {
    selectWord(15, 500); // Ensure the word is at least 15 letters and 500 possible words
  }, []); // Empty dependency array to run only once on mount

  useEffect(() => {
    setScore(currentScore);
  }, [currentScore, setScore]);

  const setSelectedHandler = useCallback(
    (index: number) => {
      if (jumbledWord && jumbledWord[index]) {
        const letter = jumbledWord[index];
        setSelectedLetters((prev) => [...prev, letter]);
        setSelectedIndices((prev) => [...prev, index]);
      }
    },
    [jumbledWord]
  );

  const clearSelectedHandler = useCallback(() => {
    setSelectedLetters([]);
    setSelectedIndices([]);
    // Force Buttons component to reset its internal state
    setButtonResetTrigger((prev) => prev + 1);
  }, []);

  const clearError = useCallback(() => {
    showPopup('');
  }, [showPopup]);

  const submitHandler = useCallback(() => {
    const word = selectedLetters.join('');

    // Always clear the selections immediately after submit, regardless of outcome
    clearSelectedHandler();

    if (word.length < 4) {
      showPopup('Слово должно быть не менее 4 букв');
      return;
    }

    if (usedWords.has(word)) {
      showPopup('Это слово уже использовано');
      return;
    }

    if (word === selectedWord) {
      showPopup('Нельзя использовать исходное слово');
      return;
    }
    if (isRussianWordValid(word, validWords)) {
      setUsedWords((prev) => new Set([...prev, word]));
      setCurrentScore((prev) => prev + calculateScore(word));
      clearError();
    } else {
      showPopup('Такого слова нет у нас в словаре :(');
      try {
        // Report invalid word to Telegram via server API (non-blocking)
        const reportUrl = process.env.NEXT_PUBLIC_REPORT_URL || '/api/telegram-report';
        fetch(reportUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            word,
            initialWord: selectedWord,
            jumbledWord,
            selectedLetters,
            meta: { reason: 'not_in_dictionary' },
          }),
        }).catch(() => {});
      } catch {
        // Silently ignore reporting errors
      }
    }
  }, [selectedLetters, clearSelectedHandler, usedWords, selectedWord, validWords, clearError, calculateScore, jumbledWord, showPopup]);

  const backspaceHandler = useCallback(() => {
    if (selectedLetters.length > 0) {
      const newSelectedLetters = [...selectedLetters];
      const newSelectedIndices = [...selectedIndices];
      newSelectedLetters.pop(); // Remove last letter
      newSelectedIndices.pop(); // Remove last index
      setSelectedLetters(newSelectedLetters);
      setSelectedIndices(newSelectedIndices);
    }
  }, [selectedLetters, selectedIndices]);
  useCallback(() => {
    setGameEnded(true);
  }, []);
  useCallback(() => {
    // Optional: Handle timer tick events if needed
  }, []);
  const startGame = useCallback(() => {
    setGameStarted(true);
  }, []);

  useEffect(() => {
    if (gameEnded) {
      showModal(
        <GameOverModal
          score={currentScore}
          usedWords={usedWords}
          validWords={validWords}
        />
      );
      setSelectedLetters([]);
      setSelectedIndices([]);
    }
  }, [currentScore, gameEnded, showModal, usedWords, usedWords.size, validWords, validWords.size]);

  // Keyboard event handler
  useEffect(() => {
    if (gameEnded) return; // Disable keyboard input when game is ended
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent default behavior for handled keys
      const key = event.key.toLowerCase();

      if (key === 'backspace') {
        event.preventDefault();
        backspaceHandler();
        return;
      }

      // Check if the pressed key corresponds to any available letter
      if (key.match(/^[а-яё]$/)) {
        event.preventDefault();

        // Find the first available button with this letter
        for (let i = 0; i < jumbledWord.length; i++) {
          const letter = jumbledWord[i].toLowerCase();
          if (letter === key && !selectedIndices.includes(i)) {
            // Check if this letter is still available based on counts
            const currentCount = selectedIndices.filter((idx) => jumbledWord[idx].toLowerCase() === letter).length;
            if (currentCount < letterCounts[letter]) {
              setSelectedHandler(i);
              break;
            }
          }
        }
      }

      // Handle Enter key to submit
      if (key === 'enter') {
        event.preventDefault();
        submitHandler();
      }

      // Handle Escape key to clear
      if (key === 'escape') {
        event.preventDefault();
        clearSelectedHandler();
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [jumbledWord, selectedIndices, letterCounts, setSelectedHandler, backspaceHandler, submitHandler, clearSelectedHandler, gameEnded]);

  return (
    <div className='mx-auto w-full'>
      <Modal {...dialogProps} />

      <WordTable usedWords={usedWords} />

      <div className=''>
        <div className='text-center'>
          <div className='relative mb-8 mt-8 flex min-h-[2rem] flex-wrap justify-center gap-1 px-2 sm:gap-2'>
            <Popup message={popupContent} />
            {selectedLetters.length > 0 ? (
              selectedLetters.map((letter, index) => (
                <span
                  key={index}
                  className='flex h-6 w-6 items-center justify-center rounded-md bg-maincolor text-sm font-bold text-lettertext sm:h-8 sm:w-8 sm:text-base'
                >
                  {letter ? letter.toUpperCase() : ''}
                </span>
              ))
            ) : (
              <span className='py-1 text-sm text-secondary sm:text-base'>Введите слово</span>
            )}
          </div>
        </div>
      </div>
      <div className={!gameStarted ? 'pointer-events-none' : gameEnded ? 'pointer-events-none opacity-50' : ''}>
        <LetterButtons
          jumbledWord={jumbledWord}
          selectedIndices={selectedIndices}
          setSelectedHandler={setSelectedHandler}
          letterCounts={letterCounts}
          clearError={clearError}
          gameStarted={gameStarted}
          onBackspace={backspaceHandler}
        />

        {/* Timer always visible when game started and not ended */}
        <div className={`mb-4 flex items-center justify-center ${!gameStarted ? 'invisible' : ''}`}>
          <Timer
            seconds={420000}
            setTimeHandler={() => {}}
            onTimerEndHandler={() => setGameEnded(true)}
            shouldStart={gameStarted && !gameEnded}
          />
        </div>
      </div>

      {/* Play button before game starts */}
      {!gameStarted && !gameEnded && (
        <div className='mb-4 flex justify-center'>
          <PlayButton onStart={startGame} />
        </div>
      )}
      {/* Control buttons during game */}
      {gameStarted && !gameEnded && (
        <ControlButtons
          onClear={clearSelectedHandler}
          onBackspace={backspaceHandler}
          onSubmit={submitHandler}
          selectedLettersCount={selectedLetters.length}
        />
      )}
      {/* Letter buttons during game */}

      {/* Play again button after game ends */}

      {gameEnded && (
        <>
          <div className='mb-4 flex justify-center'>
            <button
              onClick={() => {
                showModal(
                  <GameOverModal
                    score={currentScore}
                    usedWords={usedWords}
                    validWords={validWords}
                  />
                );
              }}
              className='rounded-full border border-primary px-4 py-3 text-xs font-medium xxs:text-sm xs:text-base'
            >
              Показать результаты
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Game;
