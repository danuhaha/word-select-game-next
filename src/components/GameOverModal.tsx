import React from 'react';

interface GameOverModalProps {
  readonly usedWords: Set<string>;
  readonly validWords: Set<string>;
  readonly score: number;
}

export const GameOverModal = (props: GameOverModalProps) => {
  const usedWordsArr = Array.from(props.usedWords);
  const validWordsArr = Array.from(props.validWords);
  // Exclude the initial word (first in validWordsArr)
  const initialWord = validWordsArr[0];
  const unusedWords = validWordsArr
    .filter((word) => word !== initialWord && !props.usedWords.has(word))
    .sort((a, b) => b.length - a.length)
    .slice(0, 10);

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
        <h3 className='mb-2 text-lg font-semibold'>Ваши слова:</h3>
        <ul className='mb-2 text-sm'>
          {usedWordsArr.slice(0, 10).map((word, idx) => (
            <li key={word + idx}>{word}</li>
          ))}
          <span>...</span>
        </ul>
        <h3 className='mb-2 text-lg font-semibold'>Пропущенные слова:</h3>
        <ul className='text-sm text-secondary'>
          {unusedWords.map((word, idx) => (
            <li key={word + idx}>{word}</li>
          ))}
          <span>...</span>
        </ul>
      </div>
      <button
        onClick={() => window.location.reload()}
        className='rounded-full border border-primary px-4 py-3 text-xs font-medium xxs:text-sm xs:text-base'
      >
        Играть снова
      </button>
    </div>
  );
};
