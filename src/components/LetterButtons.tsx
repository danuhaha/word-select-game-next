import React from 'react';

interface LetterButtonsProps {
  jumbledWord: string[];
  selectedIndices: number[];
  setSelectedHandler: (index: number) => void;
  letterCounts: Record<string, number>;
  clearError: () => void;
  gameStarted: boolean;
}

const LetterButtons: React.FC<LetterButtonsProps> = ({ jumbledWord, selectedIndices, setSelectedHandler, clearError, gameStarted }) => {
  const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  return (
    <div className={`mb-4 flex max-w-full flex-wrap justify-center gap-0.5 sm:gap-1 ${!gameStarted ? 'blur-sm filter' : ''}`}>
      {jumbledWord.map((letter, index) => (
        <button
          key={index}
          {...(isTouchDevice
            ? {
                onTouchStart: (e) => {
                  e.preventDefault();
                  if (!selectedIndices.includes(index)) {
                    setSelectedHandler(index);
                    clearError();
                  }
                },
              }
            : {
                onClick: () => {
                  if (!selectedIndices.includes(index)) {
                    setSelectedHandler(index);
                    clearError();
                  }
                },
              })}
          disabled={selectedIndices.includes(index) || !gameStarted}
          className={`h-8 w-8 cursor-pointer rounded text-sm font-bold transition-all sm:h-8 sm:w-8 sm:text-sm md:h-10 md:w-10 md:text-base ${
            selectedIndices.includes(index) ? 'cursor-not-allowed bg-cell-selected text-celltext-selected' : 'bg-cell-deselected text-celltext-deselected'
          }`}
        >
          {letter.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export default LetterButtons;
