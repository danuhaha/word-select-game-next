'use client';

import React from 'react';
import { russianLetterFrequency } from '@/utils/russianLetterFrequency';

interface RankModalProps {
  score: number;
  maxPossibleScore: number;
  initialWord: string;
  onClose: () => void;
}

const rankNames = ['Сверхразум', 'Гений', 'Профи', 'Мастер', 'Отлично', 'Хорошо', 'Неплохо', 'Разогрев', 'Хорошее начало', 'Новичок'];
const rankPercents = [100, 70, 50, 40, 25, 15, 8, 5, 2, 0];

function calculateWordRarity(word?: string): number {
  if (!word) return 0;
  return word
    .toLowerCase()
    .split('')
    .reduce((sum, letter) => sum + (russianLetterFrequency[letter] || 0), 0);
}

function getDynamicRankThresholds(maxScore: number, initialWord: string) {
  const rarity = calculateWordRarity(initialWord);
  // Highest rank is base 250 + 0.1*maxScore + rarity bonus
  let highestRankPoints = 250 + 0.01 * maxScore;
  if (rarity < 20) highestRankPoints += 20 - rarity;
  if (rarity > 20) highestRankPoints -= rarity - 20;
  highestRankPoints = Math.max(100, highestRankPoints); // never below 100
  return rankPercents.map((percent, idx) => ({
    name: rankNames[idx],
    minPoints: Math.round((highestRankPoints * percent) / 100),
  }));
}

export const RankModal = (props: RankModalProps) => {
  const ranks = getDynamicRankThresholds(props.maxPossibleScore, props.initialWord);
  const currentRankIndex = ranks.findIndex((r) => props.score >= r.minPoints);
  const currentRank = ranks[currentRankIndex] || ranks[ranks.length - 1];
  return (
    <div>
      <h2 className='mb-2 text-4xl font-bold'>Рейтинг</h2>
      <div className='max-w-[450px]'>
        <p className='mb-4 text-base text-primary'>Рейтинг рассчитывается по сложности слова и количеству возможных слов</p>
        <div className='flex flex-col'>
          <div className='ml-[46px] grid grid-cols-2 text-sm font-bold'>
            <span>Рейтинг</span>
            <span className='pr-4 text-right'>Очки</span>
          </div>
          <div className='relative flex min-h-80 flex-col py-2'>
            {/* Vertical line connecting circles, centered to circles */}
            <div className='absolute bottom-8 left-[21px] top-8 flex w-[2px] items-center justify-center'>
              {/* Background line */}
              <div className='absolute left-1/2 z-0 h-full w-[2px] -translate-x-1/2 rounded-full bg-cell-deselected' />
              {/* Progress line (inversed fill) */}
              <div
                className='absolute left-1/2 z-10 w-[2px] -translate-x-1/2 rounded-full bg-maincolor transition-all duration-500 ease-out'
                style={{ top: `${(currentRankIndex / (ranks.length - 1)) * 100}%`, height: `${100 - (currentRankIndex / (ranks.length - 1)) * 100}%` }}
              />
            </div>
            {ranks.map((rank) => {
              const isCurrent = rank.name === currentRank.name;
              const isAchieved = props.score >= rank.minPoints;
              return (
                <div
                  key={rank.name}
                  className={`z-20 flex items-center rounded-full py-2 pl-0.5 transition-all ${isCurrent ? 'bg-maincolor text-lettertext' : isAchieved ? 'text-secondary' : 'text-primary'}`}
                >
                  <div
                    className='relative flex h-6 items-center justify-center'
                    style={{ minWidth: '2.5rem' }}
                  >
                    <span
                      className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${isCurrent ? 'text-lg font-bold' : isAchieved ? 'bg-maincolor' : 'bg-cell-deselected'} ${isCurrent ? '' : 'inline-block h-[9px] w-[9px] rounded-full'}`}
                    >
                      {isCurrent ? props.score : ''}
                    </span>
                  </div>
                  <div className='ml-1 flex-1'>
                    <span className={`whitespace-nowrap text-base ${isCurrent ? 'font-bold' : ''}`}>{rank.name}</span>
                  </div>
                  {!isCurrent && <hr className='mx-4 w-full border-cell-deselected' />}
                  <div className='pr-3.5 text-right text-base'>{rank.minPoints}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RankModal;
