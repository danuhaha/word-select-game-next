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
}

const Buttons: React.FC<ButtonsProps> = ({
  jumbledWord,
  setSelectedHandler,
  clearError,
  clearSelectedHandler,
  submitHandler,
  backspaceHandler,
  letterCounts,
  shuffleHandler,
  resetTrigger,
  selectedIndices = [],
  selectedLettersCount,
  gameStarted = true,
  onStartGame,
}) => {
  const [selectedLetters, setSelectedLetters] = useState<Set<number>>(new Set());
  const [usedLetterCounts, setUsedLetterCounts] = useState<Record<string, number>>({});

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
    
    selectedIndices.forEach(index => {
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
      setUsedLetterCounts(prev => ({
        ...prev,
        [letter]: prev[letter] + 1
      }));
      setSelectedLetters(prev => {
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
    setUsedLetterCounts(Object.fromEntries(
      Object.keys(usedLetterCounts).map(key => [key, 0])
    ));
    clearSelectedHandler();
  };

  return (
    <div className="mt-4">
      <div className={`flex flex-wrap justify-center gap-0.5 sm:gap-1 mb-4 max-w-full ${!gameStarted ? 'filter blur-sm' : ''}`}>
        {jumbledWord.map((letter, index) => (
          <button
            key={index}
            onClick={() => onLetterClick(letter, index)}
            disabled={selectedLetters.has(index) || !gameStarted}
            className={`w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-xs sm:text-sm md:text-base font-bold rounded transition-all cursor-pointer
              ${selectedLetters.has(index) 
                ? 'cursor-not-allowed bg-cell-selected text-celltext-selected' 
                : 'bg-cell-deselected text-celltext-deselected'}`}
          >
            {letter.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Timer positioned between letter buttons and control buttons */}
      {gameStarted && (
        <div className="mb-4 flex items-center justify-center">
          <Timer 
            seconds={420000} // 7 minutes in milliseconds
            setTimeHandler={() => {}} // Placeholder handler
            onTimerEndHandler={() => {}} // Placeholder handler
            shouldStart={gameStarted}
          />
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-2">
        {!gameStarted ? (
          <button
            onClick={onStartGame}
            className="border rounded-full font-medium py-3 px-4 text-xs xxs:text-sm xs:text-base"
          >
            Играть
          </button>
        ) : (
          <>
            <button
              onClick={onClearHandler}
              disabled={selectedLettersCount === 0}
              className={`border rounded-full font-medium py-3 px-4 text-xs xxs:text-sm xs:text-base ${
                selectedLettersCount === 0 
                  ? 'cursor-not-allowed border-secondary text-secondary' 
                  : 'cursor-pointer border-primary text-primary'
              }`}
            >
              Очистить
            </button>
            <button
              onClick={backspaceHandler}
              disabled={selectedLettersCount === 0}
              className={`border rounded-full font-medium py-3 px-4 text-xs xxs:text-sm xs:text-base ${
                selectedLettersCount === 0 
                  ? 'cursor-not-allowed border-secondary text-secondary' 
                  : 'cursor-pointer border-primary text-primary'
              }`}
            >
              Стереть
            </button>
            
            <button
              onClick={submitHandler}
              disabled={selectedLettersCount < 4}
              className={`border rounded-full font-medium py-3 px-4 text-xs xxs:text-sm xs:text-base ${
                selectedLettersCount < 4 
                  ? 'cursor-not-allowed bg-background text-maincolormuted border-maincolormuted' 
                  : 'cursor-pointer bg-maincolor text-lettertext border-maincolor'
              }`}
            >
              Отправить
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Buttons;
