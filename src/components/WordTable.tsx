'use client';

import React, { useState, useRef, useEffect } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { motion, AnimatePresence } from 'framer-motion';

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
  // Track last animation direction
  const [expandDirection, setExpandDirection] = useState<'up' | 'down'>('up');

  // Update direction on expand/collapse
  useEffect(() => {
    setExpandDirection(isExpanded ? 'up' : 'down');
  }, [isExpanded]);

  const renderCollapsedView = () => {
    // Move lengthGroups and limitedSortedLengths to the top of renderCollapsedView so they are in scope
    const wordsArray = Array.from(usedWords);
    const lengthGroups: Record<number, string[]> = {};
    wordsArray.forEach((word) => {
      const len = word.length;
      if (!lengthGroups[len]) lengthGroups[len] = [];
      lengthGroups[len].push(word);
    });
    const sortedLengths = Object.keys(lengthGroups)
      .map(Number)
      .sort((a, b) => a - b);
    const maxDisplayedLengths = 6;
    const limitedSortedLengths = sortedLengths.slice(0, maxDisplayedLengths);

    return (
      <div
        className={`relative w-full cursor-pointer rounded-lg border border-secondary bg-background px-4 py-2 transition-colors`}
        onMouseDown={(e) => {
          if (isExpanded || usedWords.size === 0) {
            setIsExpanded(false);
            e.stopPropagation();
            return;
          }
          setIsExpanded(true);
        }}
        ref={containerRef}
      >
        <div className='flex items-center'>
          <div className='relative flex-1 overflow-hidden'>
            <AnimatePresence mode='wait'>
              {isExpanded && usedWords.size !== 0 ? (
                <motion.div
                  key='summary'
                  initial={{ y: expandDirection === 'up' ? -10 : 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: expandDirection === 'up' ? -10 : 10, opacity: 0 }}
                  transition={{ duration: 0.1 }}
                  className='flex gap-1'
                >
                  <span className='px-2 py-1 text-sm font-medium text-primary'>
                    Вы нашли {usedWords.size} {getWordDeclension(usedWords.size)}
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  key='words'
                  initial={{ y: expandDirection === 'up' ? -10 : 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: expandDirection === 'up' ? -10 : 10, opacity: 0 }}
                  transition={{ duration: 0.1 }}
                  className='flex gap-1'
                >
                  {usedWords.size === 0 ? (
                    <span className='px-2 py-1 text-sm text-secondary'>Начните составлять слова...</span>
                  ) : (
                    <AnimatePresence initial={false}>
                      {visibleWords.map((word, index) => (
                        <motion.span
                          key={index}
                          initial={{ x: -40, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          exit={{ x: -40, opacity: 0 }}
                          transition={{ duration: 0.1, ease: 'easeOut' }}
                          className='flex-shrink-0 whitespace-nowrap rounded bg-background px-2 py-1 text-sm font-medium'
                        >
                          {word.charAt(0).toUpperCase() + word.slice(1)}
                        </motion.span>
                      ))}
                    </AnimatePresence>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className='ml-2'>
            <IoIosArrowDown className={`text-secondary transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`} />
          </div>
        </div>
        {/* Expanded view below collapsed view, not a separate box */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              key='expanded'
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className='overflow-hidden'
            >
              <div className='max-h-80 overflow-y-auto py-2'>
                <div className='w-full'>
                  <div className='flex w-full flex-wrap gap-2'>
                    {usedWords.size === 0 ? (
                      <p className='w-full text-center text-secondary'>Пока слов не найдено</p>
                    ) : (
                      limitedSortedLengths.map((len: number) => (
                        <div
                          key={len}
                          className=''
                        >
                          <div className='mb-2 whitespace-nowrap px-2 text-xs font-bold text-secondary'>
                            {len} {len === 4 ? 'буквы' : 'букв'}
                          </div>
                          {lengthGroups[len].map((word: string, idx: number) => (
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
            </motion.div>
          )}
        </AnimatePresence>
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

  // Helper for Russian word declension
  const getWordDeclension = (count: number) => {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;
    if (lastDigit === 1 && lastTwoDigits !== 11) return 'слово';
    if ([2, 3, 4].includes(lastDigit) && ![12, 13, 14].includes(lastTwoDigits)) return 'слова';
    return 'слов';
  };

  return <div className='relative'>{renderCollapsedView()}</div>;
};

export default WordTable;
