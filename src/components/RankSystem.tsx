'use client';

import React from 'react';
import { russianLetterFrequency } from '@/utils/russianLetterFrequency';

interface RankSystemProps {
  score: number;
  maxPossibleScore: number;
  initialWord: string;
}

const rankNames = [
  'Новичок',
  'Хорошее начало',
  'Разогрев',
  'Неплохо',
  'Хорошо',
  'Отлично',
  'Мастер',
  'Профи',
  'Гений',
  'Сверхразум',
];
const rankPercents = [0, 2, 5, 8, 15, 25, 40, 50, 70, 100];

function getDynamicRankThresholds(maxScore: number, initialWord: string) {
  const rarity = initialWord.toLowerCase()
    .split('')
    .reduce((sum, letter) => sum + (russianLetterFrequency[letter] || 0), 0);
  // Highest rank is base 250 + 0.1*maxScore + rarity bonus
  let highestRankPoints = 250 + 0.01 * maxScore;
  if (rarity < 20) highestRankPoints += (20 - rarity);
  if (rarity > 20) highestRankPoints -= (rarity - 20);
  highestRankPoints = Math.max(100, highestRankPoints); // never below 100
  console.log('highest rank', highestRankPoints, 'rarity',rarity)
  return rankPercents.map((percent, idx) => ({
    name: rankNames[idx],
    minPoints: Math.round((highestRankPoints * percent) / 100),
  }));
}

const RankSystem: React.FC<RankSystemProps> = ({ score, maxPossibleScore, initialWord }) => {
  const ranks = getDynamicRankThresholds(maxPossibleScore, initialWord);
  const currentRank = [...ranks].reverse().find((rank) => score >= rank.minPoints) || ranks[0];
  const currentRankIndex = ranks.findIndex((rank) => rank.name === currentRank.name);
  const progressLineWidth = currentRankIndex === 0 ? 0 : (currentRankIndex / (ranks.length - 1)) * 100;

  return (
    <div className='flex items-center'>
      {/* Current rank name on the left */}
      <div className='flex-shrink-0'>
        <h2 className='text-red ml-2 mr-2 text-lg font-bold sm:text-xl'>{currentRank.name}</h2>
      </div>
      {/* Progress line with circular markings */}
      <div className='relative mr-2 flex-1'>
        <div className='absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 transform rounded-full bg-cell-deselected' />
        <div
          className='absolute left-0 top-1/2 h-px -translate-y-1/2 transform rounded-full bg-maincolor transition-all duration-500 ease-out'
          style={{ width: `${progressLineWidth}%` }}
        />
        <div className='relative flex h-6 items-center justify-between'>
          {ranks.map((rank, index) => {
            const isAchieved = score >= rank.minPoints;
            const isCurrent = rank.name === currentRank.name;
            return (
              <div
                key={rank.name}
                className='group relative flex flex-col items-center'
                style={{ left: index === 0 ? '0' : index === ranks.length - 1 ? 'auto' : 'auto' }}
              >
                <div
                  className={`flex h-2 w-2 items-center justify-center rounded-full border-2 bg-cell-deselected transition-all duration-300 ${
                    isAchieved ? 'border-maincolor bg-maincolor' : 'border-cell-deselected bg-cell-deselected'
                  } ${isCurrent ? 'h-7 w-7' : ''}`}
                >
                  {isCurrent && <span className='text-xs font-bold text-lettertext'>{score}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RankSystem;
