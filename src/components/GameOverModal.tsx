import React, { useState } from 'react';


interface GameOverModalProps {
  readonly usedWords: Set<string>;
  readonly validWords: Set<string>;
  readonly score: number;
}


function isMobile() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(hover: none) and (pointer: coarse)').matches;
}

const DefinitionWord: React.FC<{ word: string }> = ({ word }) => {
  const [show, setShow] = useState(false);
  const mobile = typeof window !== 'undefined' ? isMobile() : false;

  // Tooltip for desktop, click popup for mobile
  return (
    <span
      className="relative cursor-help"
      onMouseEnter={() => !mobile && setShow(true)}
      onMouseLeave={() => !mobile && setShow(false)}
      onClick={() => mobile && setShow((v) => !v)}
      tabIndex={0}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      {word}
    </span>
  );
};

export const GameOverModal: React.FC<GameOverModalProps> = (props) => {
  const usedWordsArr = Array.from(props.usedWords);
  const validWordsArr = Array.from(props.validWords);
  // Exclude the initial word (first in validWordsArr)
  const initialWord = validWordsArr[0];
  // Shuffle unused words and select 30 random ones
  const shuffledUnused = [...validWordsArr].filter((word) => word !== initialWord && !props.usedWords.has(word));
  for (let i = shuffledUnused.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledUnused[i], shuffledUnused[j]] = [shuffledUnused[j], shuffledUnused[i]];
  }
  const unusedWords = shuffledUnused.slice(0, 30);

  return (
    <div className='rounded-lg bg-background text-center'>
      <h1 className='my-4 text-center text-4xl font-black'>Время вышло!</h1>
      <p className='mb-1 text-lg font-bold'>
        Ваш финальный счёт: <span className='text-maincolor'>{props.score}</span>
      </p>
      <p className='mb-4 text-xs font-semibold text-primary'>
        Найдено слов: {usedWordsArr.length} из {validWordsArr.length}
      </p>
      <div className='mb-4'>
        <h3 className='mb-2 text-lg font-semibold'>Пропущенные слова:</h3>
        <div className='flex flex-row justify-center gap-2'>
          {[0, 1, 2].map((col) => (
            <ul
              className='text-sm text-secondary'
              key={col}
            >
              {unusedWords
                .filter((_, idx) => Math.floor(idx / 10) === col)
                .map((word, idx) => (
                  <li key={String(word) + idx}>{word}</li>
                ))}
            </ul>
          ))}
        </div>
      </div>
      <button
        onClick={() => window.location.reload()}
        className='rounded-full border border-primary px-4 py-3 text-xs font-medium xxs:text-sm xs:text-base'
      >
        Играть снова
      </button>
    </div>
  );
}
