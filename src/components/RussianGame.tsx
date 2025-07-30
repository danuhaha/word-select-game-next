'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Buttons from './Buttons';
import WordTable from './WordTable';
import Timer from './Timer';
import { getRandomRussianWord, prepareRussianWord, getValidRussianWords, isRussianWordValid } from '@/utils/russianDictionary';

interface GameProps {
  wordLength: number;
  getData: (validWords: string[]) => void;
  setScore: (score: number) => void;
  setMaxPossibleScore: (maxScore: number) => void;
}

const RussianGame: React.FC<GameProps> = ({ wordLength, getData, setScore, setMaxPossibleScore }) => {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [jumbledWord, setJumbledWord] = useState<string[]>([]);
  const [validWords, setValidWords] = useState<Set<string>>(new Set());
  const [usedWords, setUsedWords] = useState<Set<string>>(new Set());
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [letterCounts, setLetterCounts] = useState<Record<string, number>>({});
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [buttonResetTrigger, setButtonResetTrigger] = useState<number>(0);
  const [maxPossibleScore, setMaxPossibleScoreState] = useState<number>(0);
  const [gameEnded, setGameEnded] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  // Auto-clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

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

  const calculateMaxPossibleScore = useCallback((words: Set<string>): number => {
    let totalScore = 0;
    words.forEach(word => {
      if (word.length >= 4) { // Only count words 4+ letters long
        totalScore += calculateScore(word);
      }
    });
    return totalScore;
  }, [calculateScore]);

  const selectWord = useCallback((minLength: number) => {
    const word = getRandomRussianWord(minLength);
    setSelectedWord(word);
    prepareWord(word, (prepared) => {
      const valid = getValidRussianWords(word);
      setValidWords(valid);
      const maxScore = calculateMaxPossibleScore(valid);
      setMaxPossibleScore(maxScore);
      setMaxPossibleScoreState(maxScore); // Pass to parent component
      getData(Array.from(valid));
    });
  }, [calculateMaxPossibleScore, getData, setMaxPossibleScore, prepareWord]);

  useEffect(() => {
    selectWord(15); // Ensure the word is at least 15 letters long
  }, []); // Empty dependency array to run only once on mount

  useEffect(() => {
    setScore(currentScore);
  }, [currentScore, setScore]);

  const setSelectedHandler = useCallback((index: number) => {
    if (jumbledWord && jumbledWord[index]) {
      const letter = jumbledWord[index];
      setSelectedLetters((prev) => [...prev, letter]);
      setSelectedIndices((prev) => [...prev, index]);
    }
  }, [jumbledWord]);

  const clearSelectedHandler = useCallback(() => {
    setSelectedLetters([]);
    setSelectedIndices([]);
    // Force Buttons component to reset its internal state
    setButtonResetTrigger(prev => prev + 1);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const submitHandler = useCallback(() => {
    const word = selectedLetters.join('');

    // Always clear the selections immediately after submit, regardless of outcome
    clearSelectedHandler();

    if (word.length < 4) {
      setError('Слово должно быть не менее 4 букв');
      return;
    }

    if (usedWords.has(word)) {
      setError('Вы уже использовали это слово');
      return;
    }

    if (isRussianWordValid(word, validWords)) {
      setUsedWords((prev) => new Set([...prev, word]));
      setCurrentScore((prev) => prev + calculateScore(word));
      clearError();
    } else {
      setError('Недопустимое слово');
    }
  }, [selectedLetters, usedWords, validWords, clearSelectedHandler, calculateScore]);

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

  const onTimerEnd = useCallback(() => {
    setGameEnded(true);
  }, []);

  const setTimeHandler = useCallback((data: { total: number }) => {
    // Optional: Handle timer tick events if needed
  }, []);

  const startGame = useCallback(() => {
    setGameStarted(true);
  }, []);

  // Keyboard event handler
  useEffect(() => {
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
            const currentCount = selectedIndices.filter(idx => jumbledWord[idx].toLowerCase() === letter).length;
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
  }, [jumbledWord, selectedIndices, letterCounts, setSelectedHandler, backspaceHandler, submitHandler, clearSelectedHandler]);

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className=" bg-background rounded-lg p-3 sm:p-6 shadow-lg relative">
        <div className="text-center mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-primary">Слова</h1>
          
          {/* Timer Display - always centered */}
          <div className="mb-4 flex items-center justify-center">
            <Timer 
              seconds={420000} // 7 minutes in milliseconds
              setTimeHandler={setTimeHandler}
              onTimerEndHandler={onTimerEnd}
              shouldStart={gameStarted}
            />
          </div>

          {/* Game Over Overlay */}
          {gameEnded && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-background p-8 rounded-lg text-center border border-primary">
                <h2 className="text-2xl font-bold mb-4 text-primary">Время вышло!</h2>
                <p className="text-lg mb-2">Ваш финальный счёт: {currentScore}</p>
                <p className="text-sm text-primary mb-4">
                  Найдено слов: {usedWords.size} из {validWords.size}
                </p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="px-6 py-2 bg-primary text-background rounded-lg hover:opacity-80"
                >
                  Играть снова
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Error popup - positioned absolutely */}
        {error && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
            <div className="px-6 py-3 border rounded-lg shadow-lg bg-background border-primary">
              <p className="text-primary font-medium">{error}</p>
            </div>
          </div>
        )}

        <div className="mb-6">
          <div className="text-center mb-4">
            <div className="flex justify-center gap-1 sm:gap-2 flex-wrap min-h-[2rem] px-2">
              {selectedLetters.length > 0 ? (
                selectedLetters.map((letter, index) => (
                    <span
                    key={index}
                    className="inline-block w-6 h-6 sm:w-8 sm:h-8 rounded-md font-bold text-sm sm:text-base flex items-center justify-center bg-maincolor text-lettertext"
                    >
                    {letter ? letter.toUpperCase() : ''}
                    </span>
                ))
              ) : (
                <span className="italic text-sm sm:text-base text-primary">Выберите буквы для составления слова</span>
              )}
            </div>
          </div>
        </div>

        {/* Disable interactions when game has ended */}
        <div className={gameEnded ? 'pointer-events-none opacity-50' : ''}>
          <Buttons
            jumbledWord={jumbledWord}
            setSelectedHandler={setSelectedHandler}
            clearError={clearError}
            clearSelectedHandler={clearSelectedHandler}
            submitHandler={submitHandler}
            backspaceHandler={backspaceHandler}
            letterCounts={letterCounts}
            selectedIndices={selectedIndices}
            resetTrigger={buttonResetTrigger}
            selectedLettersCount={selectedLetters.length}
            gameStarted={gameStarted}
            onStartGame={startGame}
          />
        </div>
      </div>
      {gameStarted && usedWords.size > 0 && (
        <WordTable usedWords={usedWords} />
      )}
    </div>
  );
};

export default RussianGame;