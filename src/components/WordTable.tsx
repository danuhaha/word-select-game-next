'use client';

import React, { useState, useRef, useEffect } from 'react';

interface WordTableProps {
  usedWords: Set<string>;
}

const WordTable: React.FC<WordTableProps> = ({ usedWords }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [visibleWords, setVisibleWords] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateVisibleWords = () => {
      const wordsArray = Array.from(usedWords);
      setVisibleWords(wordsArray.reverse()); // Ensure new words appear on the left
    };

    updateVisibleWords();
    window.addEventListener('resize', updateVisibleWords);
    return () => window.removeEventListener('resize', updateVisibleWords);
  }, [usedWords]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const renderCollapsedView = () => {
    return (
      <div 
        className="relative w-full h-12 px-4 mb-5 py-2 rounded-lg border border-secondary bg-background transition-colors cursor-pointer overflow-hidden"
        onClick={toggleExpanded}
        ref={containerRef}
      >
        <div className="flex items-center h-full">
          <div className="flex-1 overflow-hidden">
            <div className="flex gap-2">
              {usedWords.size === 0 ? (
                <span className="text-secondary text-sm">Начните составлять слова...</span>
              ) : (
                visibleWords.map((word, index) => (
                  <span 
                    key={index} 
                    className="px-2 py-1 bg-background rounded text-sm font-medium whitespace-nowrap flex-shrink-0"
                  >
                    {word.charAt(0).toUpperCase() + word.slice(1)}
                  </span>
                ))
              )}
            </div>
          </div>
          <div className="ml-2">
            <span className="text-secondary">▼</span>
          </div>
        </div>
      </div>
    );
  };

  const renderExpandedView = () => {
    const wordsArray = Array.from(usedWords).sort(); // Sort words alphabetically

    return (
      <div 
        className="absolute top-full left-0 z-50 mt-2 w-full bg-background border border-secondary rounded-lg shadow-lg max-h-96 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 overflow-y-auto max-h-80">
          <div className="">
            {usedWords.size === 0 ? (
              <p className="text-secondary text-center">Пока слов не найдено</p>
            ) : (
              wordsArray.map((word, index) => (
                <div 
                  key={index}
                  className="px-3 bg-background rounded-lg transition-colors"
                >
                  <span className="text-sm font-medium">{word.charAt(0).toUpperCase() + word.slice(1)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative">
      {renderCollapsedView()}
      {isExpanded && renderExpandedView()}
    </div>
  );
};

export default WordTable;
