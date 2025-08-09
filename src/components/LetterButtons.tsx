import React from 'react';

interface LetterButtonsProps {
  jumbledWord: string[];
  selectedIndices: number[];
  setSelectedHandler: (index: number) => void;
  letterCounts: Record<string, number>;
  clearError: () => void;
  gameStarted: boolean;
  onBackspace: () => void;
}

const LetterButtons: React.FC<LetterButtonsProps> = ({ jumbledWord, selectedIndices, setSelectedHandler, clearError, gameStarted, onBackspace }) => {
  const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
  const lastSelectedIndex = selectedIndices[selectedIndices.length - 1];

  return (
    <div className={`mb-4 flex max-w-full flex-wrap justify-center gap-0.5 sm:gap-1 ${!gameStarted ? 'blur-sm filter' : ''}`}>
      {jumbledWord.map((letter, index) => (
        <button
          key={index}
          {...(isTouchDevice
            ? {
                onTouchStart: (e) => {
                  e.preventDefault();
                  if (index === lastSelectedIndex) {
                    onBackspace();
                    clearError();
                  } else if (!selectedIndices.includes(index)) {
                    setSelectedHandler(index);
                    clearError();
                  }
                },
              }
            : {
                onClick: () => {
                  if (index === lastSelectedIndex) {
                    onBackspace();
                    clearError();
                  } else if (!selectedIndices.includes(index)) {
                    setSelectedHandler(index);
                    clearError();
                  }
                },
              })}
          disabled={(!gameStarted) || (selectedIndices.includes(index) && index !== lastSelectedIndex)}
          className={`h-8 w-8 cursor-pointer rounded text-sm font-bold transition-all sm:h-8 sm:w-8 sm:text-sm md:h-10 md:w-10 md:text-base ${
            selectedIndices.includes(index) ? 'bg-cell-selected text-celltext-selected' : 'bg-cell-deselected text-celltext-deselected'
          } ${selectedIndices.includes(index) && index !== lastSelectedIndex ? 'cursor-not-allowed' : ''}`}
        >
          {letter.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export default LetterButtons;
