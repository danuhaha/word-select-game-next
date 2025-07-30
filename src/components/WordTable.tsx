'use client';

import React from 'react';

interface WordTableProps {
  usedWords: Set<string>;
}

const WordTable: React.FC<WordTableProps> = ({ usedWords }) => {
  /** classify the words according to length and display
   * @returns {JSX.Element} - returns JSX markup
   */
  const classifyLength = () => {
    // Add safety check for usedWords
    if (!usedWords || usedWords.size === 0) {
      return (
        <div className="text-center text-gray-400">
          <p>Пока слов не найдено. Начните составлять слова!</p>
        </div>
      );
    }

    const wordsByLength: Record<number, string[]> = {};

    usedWords.forEach((word) => {
      const length = word.length;
      if (!wordsByLength[length]) {
        wordsByLength[length] = [];
      }
      wordsByLength[length].push(word);
    });

    return (
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Object.keys(wordsByLength).map(length => (
          <div key={length} className="p-3 rounded-lg shadow-lg transform transition-all bg-background">
            <h2 className="text-lg font-bold mb-2 text-center text-primary">{length} букв</h2>
            <ul className="space-y-1">
              {wordsByLength[parseInt(length)].map((word, index) => (
                <li key={index} className="px-2 py-1 rounded-md font-medium tracking-wide text-center capitalize transition-colors  text-sm bg-background">{word}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="mt-8 text-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-primary">Ваши слова</h1>
      {classifyLength()}
    </div>
  );
};

export default WordTable;
