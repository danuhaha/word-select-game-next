'use client';

import React from 'react';

interface RankSystemProps {
  score: number;
  maxPossibleScore: number;
}

const RankSystem: React.FC<RankSystemProps> = ({ score }) => {
  const ranks = [
    { name: 'Новичок', minPoints: 0 },
    { name: 'Хорошее начало', minPoints: 4 },
    { name: 'Разогрев', minPoints: 10 },
    { name: 'Неплохо', minPoints: 16 },
    { name: 'Хорошо', minPoints: 30 },
    { name: 'Отлично', minPoints: 50 },
    { name: 'Мастер', minPoints: 80 },
    { name: 'Профессионал', minPoints: 100 },
    { name: 'Гений', minPoints: 140 },
    { name: 'Сверхразум', minPoints: 200 },
  ];

  // Find current rank based on score
  const currentRank = [...ranks].reverse().find((rank) => score >= rank.minPoints) || ranks[0];

  // Calculate the position of the current rank circle (as percentage of total width)
  const currentRankIndex = ranks.findIndex((rank) => rank.name === currentRank.name);
  const progressLineWidth = currentRankIndex === 0 ? 0 : (currentRankIndex / (ranks.length - 1)) * 100;

  return (
    <div className='flex items-center'>
      {/* Current rank name on the left */}
      <div className='min-w-[120px] flex-shrink-0'>
        <h2 className='text-red ml-2 mr-2 text-lg font-bold sm:text-xl'>{currentRank.name}</h2>
      </div>

      {/* Progress line with circular markings */}
      <div className='relative mr-2 flex-1'>
        {/* Background line */}
        <div className='absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 transform rounded-full bg-secondary' />

        {/* Progress fill */}
        <div
          className='absolute left-0 top-1/2 h-px -translate-y-1/2 transform rounded-full bg-maincolor transition-all duration-500 ease-out'
          style={{ width: `${progressLineWidth}%` }}
        />

        {/* Circular markings for each rank */}
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
                    isAchieved ? 'border-maincolor bg-maincolor' : 'border-secondary bg-secondary'
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
