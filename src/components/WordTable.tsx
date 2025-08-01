'use client';

import React, { useState, useRef, useEffect } from 'react';
import { IoIosArrowDown } from 'react-icons/io';

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
  const renderCollapsedView = () => {
    return (
      <div
        className='relative h-10 w-full cursor-pointer overflow-hidden rounded-lg border border-secondary bg-background px-4 py-2 transition-colors'
        onMouseDown={(e) => {
          if (isExpanded) {
            setIsExpanded(false);
            e.stopPropagation();
            return;
          }
          setIsExpanded(true);
        }}
        ref={containerRef}
      >
        <div className='flex h-full items-center'>
          <div className='flex-1 overflow-hidden'>
            <div className='flex gap-1'>
              {usedWords.size === 0 ? (
                <span className='text-sm text-secondary'>Начните составлять слова...</span>
              ) : (
                visibleWords.map((word, index) => (
                  <span
                    key={index}
                    className='flex-shrink-0 whitespace-nowrap rounded bg-background px-2 py-1 text-sm font-medium'
                  >
                    {word.charAt(0).toUpperCase() + word.slice(1)}
                  </span>
                ))
              )}
            </div>
          </div>
          <div className='ml-2'>
            <IoIosArrowDown className={`text-secondary transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`} />
          </div>
        </div>
      </div>
    );
  };

  // Close expanded view on outside click
  useEffect(() => {
    if (!isExpanded) return;
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isExpanded]);

  const renderExpandedView = () => {
    // Group words by length
    const wordsArray = Array.from(usedWords);
    const lengthGroups: Record<number, string[]> = {};
    wordsArray.forEach((word) => {
      const len = word.length;
      if (!lengthGroups[len]) lengthGroups[len] = [];
      lengthGroups[len].push(word);
    });
    // Sort each group alphabetically
    Object.keys(lengthGroups).forEach((len) => {
      lengthGroups[Number(len)] = lengthGroups[Number(len)].sort((a, b) => a.localeCompare(b));
    });
    // Sort lengths ascending
    const sortedLengths = Object.keys(lengthGroups)
      .map(Number)
      .sort((a, b) => a - b);

    // Limit the number of displayed lengths
    const maxDisplayedLengths = 6;
    const limitedSortedLengths = sortedLengths.slice(0, maxDisplayedLengths);

    return (
      <div
        className='absolute left-0 top-full z-50 mt-2 max-h-96 w-full overflow-hidden rounded-lg border border-secondary bg-background shadow-lg'
        onClick={(e) => e.stopPropagation()}
        ref={containerRef}
      >
        <div className='max-h-80 overflow-y-auto px-4 py-2'>
          <div className='w-full'>
            <div className='flex w-full flex-wrap gap-2'>
              {usedWords.size === 0 ? (
                <p className='w-full text-center text-secondary'>Пока слов не найдено</p>
              ) : (
                limitedSortedLengths.map((len) => (
                  <div
                    key={len}
                    className='flex min-w-[60px] flex-1 flex-col'
                  >
                    <div className='mb-2 px-2 text-xs font-bold text-secondary'>{len} букв</div>
                    {lengthGroups[len].map((word, idx) => (
                      <div
                        key={word + idx}
                        className='rounded-lg bg-background px-2 transition-colors'
                      >
                        <span className='text-sm font-medium'>{word.charAt(0).toUpperCase() + word.slice(1)}</span>
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className='relative'>
      {renderCollapsedView()}
      {isExpanded && renderExpandedView()}
    </div>
  );
};

export default WordTable;
