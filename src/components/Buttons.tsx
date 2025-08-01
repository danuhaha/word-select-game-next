'use client';

import React, { useState, useEffect } from 'react';
import Timer from './Timer'; // Import Timer component

interface ButtonsProps {
  jumbledWord: string[];
  setSelectedHandler: (index: number) => void;
  clearError: () => void;
  clearSelectedHandler: () => void;
  submitHandler: () => void;
  backspaceHandler: () => void; // Add backspace handler
  letterCounts: Record<string, number>;
  shuffleHandler?: () => void; // Optional shuffle handler
  resetTrigger?: number; // New prop to trigger reset
  selectedIndices?: number[]; // Add this to sync button states
  selectedLettersCount: number; // Add prop to track selected letters count
  gameStarted?: boolean; // New prop to control game state
  onStartGame?: () => void; // Callback for starting the game
  onTimerEnd: () => void; // Callback for when the timer ends
}

const Buttons: React.FC<ButtonsProps> = ({
  jumbledWord,
  setSelectedHandler,
  clearError,
  clearSelectedHandler,
  submitHandler,
  backspaceHandler,
  letterCounts,
  resetTrigger,
  selectedIndices = [],
  selectedLettersCount,
  gameStarted = true,
  onStartGame,
  onTimerEnd,
}) => {
  const [selectedLetters, setSelectedLetters] = useState<Set<number>>(new Set());
  const [usedLetterCounts, setUsedLetterCounts] = useState<Record<string, number>>({});
  const [timerEnded, setTimerEnded] = useState(false);

  useEffect(() => {
    // Initialize letter counts
    const initialUsedCounts: Record<string, number> = {};

    jumbledWord.forEach((letter) => {
      initialUsedCounts[letter] = 0;
    });

    setUsedLetterCounts(initialUsedCounts);
    setSelectedLetters(new Set());
  }, [jumbledWord]);

  // Sync with parent component's selectedIndices
  useEffect(() => {
    setSelectedLetters(new Set(selectedIndices));

    // Recalculate used letter counts based on selected indices
    const newUsedCounts: Record<string, number> = {};
    jumbledWord.forEach((letter) => {
      newUsedCounts[letter] = 0;
    });

    selectedIndices.forEach((index) => {
      if (index < jumbledWord.length) {
        const letter = jumbledWord[index];
        newUsedCounts[letter] = (newUsedCounts[letter] || 0) + 1;
      }
    });

    setUsedLetterCounts(newUsedCounts);
  }, [selectedIndices, jumbledWord]);

  // Reset button states when resetTrigger changes
  useEffect(() => {
    if (resetTrigger !== undefined) {
      setSelectedLetters(new Set());
      const resetCounts: Record<string, number> = {};
      jumbledWord.forEach((letter) => {
        resetCounts[letter] = 0;
      });
      setUsedLetterCounts(resetCounts);
    }
  }, [resetTrigger, jumbledWord]);

  const onLetterClick = (letter: string, index: number) => {
    if (selectedLetters.has(index)) {
      return;
    }
    if (usedLetterCounts[letter] < letterCounts[letter]) {
      setUsedLetterCounts((prev) => ({
        ...prev,
        [letter]: prev[letter] + 1,
      }));
      setSelectedLetters((prev) => {
        const updated = new Set(prev);
        updated.add(index);
        return updated;
      });
      setSelectedHandler(index); // Pass the index, not the letter
      clearError();
    }
  };

  const onClearHandler = () => {
    setSelectedLetters(new Set());
    setUsedLetterCounts(Object.fromEntries(Object.keys(usedLetterCounts).map((key) => [key, 0])));
    clearSelectedHandler();
  };

  // Handler for timer end
  const handleTimerEnd = () => {
    setTimerEnded(true);
    if (onTimerEnd) onTimerEnd();
  };

  // Button rendering logic moved outside JSX to fix ESLint error
  const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
  const startButton = (
    <button
      {...(isTouchDevice
        ? {
            onTouchStart: (e) => {
              e.preventDefault();
              if (onStartGame) onStartGame();
            },
          }
        : {
            onClick: () => {
              if (onStartGame) onStartGame();
            },
          })}
      className='rounded-full border border-primary px-4 py-3 text-xs font-medium xxs:text-sm xs:text-base'
    >
      Играть
    </button>
  );

  return (
    <div className=''>
      <div className={`mb-4 flex max-w-full flex-wrap justify-center gap-0.5 sm:gap-1 ${!gameStarted ? 'blur-sm filter' : ''}`}>
        {jumbledWord.map((letter, index) => {
          // Simple device detection
          const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
          return (
            <button
              key={index}
              {...(isTouchDevice
                ? {
                    onTouchStart: (e) => {
                      e.preventDefault();
                      onLetterClick(letter, index);
                    },
                  }
                : { onClick: () => onLetterClick(letter, index) })}
              disabled={selectedLetters.has(index) || !gameStarted}
              className={`h-8 w-8 cursor-pointer rounded text-sm font-bold transition-all sm:h-8 sm:w-8 sm:text-sm md:h-10 md:w-10 md:text-base ${
                selectedLetters.has(index) ? 'cursor-not-allowed bg-cell-selected text-celltext-selected' : 'bg-cell-deselected text-celltext-deselected'
              }`}
            >
              {letter.toUpperCase()}
            </button>
          );
        })}
      </div>

      <div className={`mb-4 flex items-center justify-center ${!gameStarted ? 'invisible' : ''}`}>
        <Timer
          seconds={420000} // 7 minutes in milliseconds
          setTimeHandler={() => {}} // Placeholder handler
          onTimerEndHandler={handleTimerEnd} // Use local handler
          shouldStart={gameStarted && !timerEnded}
        />
      </div>

      <div className='flex flex-wrap justify-center gap-2'>
        {timerEnded ? (
          <button
            onClick={() => window.location.reload()}
            className='rounded-full border border-primary px-4 py-3 text-xs font-medium xxs:text-sm xs:text-base'
            disabled={false}
          >
            Играть снова
          </button>
        ) : !gameStarted ? (
          startButton
        ) : (
          <>
            {(() => {
              const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
              return (
                <button
                  {...(isTouchDevice
                    ? {
                        onTouchStart: (e) => {
                          e.preventDefault();
                          onClearHandler();
                        },
                      }
                    : { onClick: () => onClearHandler() })}
                  disabled={selectedLettersCount === 0}
                  className={`rounded-full border px-4 py-3 text-xs font-medium xxs:text-sm xs:text-base ${
                    selectedLettersCount === 0 ? 'cursor-not-allowed border-secondary text-secondary' : 'cursor-pointer border-primary text-primary'
                  }`}
                >
                  Очистить
                </button>
              );
            })()}
            {(() => {
              const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
              return (
                <button
                  {...(isTouchDevice
                    ? {
                        onTouchStart: (e) => {
                          e.preventDefault();
                          backspaceHandler();
                        },
                      }
                    : { onClick: () => backspaceHandler() })}
                  disabled={selectedLettersCount === 0}
                  className={`rounded-full border px-4 py-3 text-xs font-medium xxs:text-sm xs:text-base ${
                    selectedLettersCount === 0 ? 'cursor-not-allowed border-secondary text-secondary' : 'cursor-pointer border-primary text-primary'
                  }`}
                >
                  Стереть
                </button>
              );
            })()}
            {(() => {
              const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
              return (
                <button
                  {...(isTouchDevice
                    ? {
                        onTouchStart: (e) => {
                          e.preventDefault();
                          submitHandler();
                        },
                      }
                    : { onClick: () => submitHandler() })}
                  disabled={selectedLettersCount < 4}
                  className={`rounded-full border px-4 py-3 text-xs font-medium xxs:text-sm xs:text-base ${
                    selectedLettersCount < 4
                      ? 'cursor-not-allowed border-maincolormuted bg-background text-maincolormuted'
                      : 'cursor-pointer border-maincolor bg-maincolor text-lettertext'
                  }`}
                >
                  Отправить
                </button>
              );
            })()}
          </>
        )}
      </div>
    </div>
  );
};

export default Buttons;
