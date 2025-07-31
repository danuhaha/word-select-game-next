'use client';

import React from 'react';

interface RankSystemProps {
  score: number;
  maxPossibleScore: number;
}

const RankSystem: React.FC<RankSystemProps> = ({ score, maxPossibleScore }) => {
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
  const currentRank = [...ranks].reverse().find(rank => score >= rank.minPoints) || ranks[0];

  // Calculate the position of the current rank circle (as percentage of total width)
  const currentRankIndex = ranks.findIndex(rank => rank.name === currentRank.name);
  const progressLineWidth = currentRankIndex === 0 ? 0 : (currentRankIndex / (ranks.length - 1)) * 100;

  return (
    <div className="flex items-center ">
      {/* Current rank name on the left */}
      <div className="flex-shrink-0 min-w-[120px]">
        <h2 className="ml-2 text-lg sm:text-xl font-bold text-red mr-2">
          {currentRank.name}
        </h2>
      </div>

      {/* Progress line with circular markings */}
      <div className="flex-1 relative mr-2">
        {/* Background line */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-secondary rounded-full transform -translate-y-1/2" />

        {/* Progress fill */}
        <div 
          className="absolute top-1/2 left-0 h-px bg-maincolor rounded-full transform -translate-y-1/2 transition-all duration-500 ease-out"
          style={{ width: `${progressLineWidth}%` }}
        />

        {/* Circular markings for each rank */}
        <div className="relative flex justify-between items-center h-6">
          {ranks.map((rank, index) => {
            const isAchieved = score >= rank.minPoints;
            const isCurrent = rank.name === currentRank.name;

            return (
              <div
                key={rank.name}
                className="relative flex flex-col items-center group"
                style={{ left: index === 0 ? '0' : index === ranks.length - 1 ? 'auto' : 'auto' }}
              >
                <div
                  className={`w-2 h-2 bg-cell-deselected rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                    isAchieved 
                    ? 'bg-maincolor border-maincolor' 
                    : 'bg-secondary border-secondary'
                  } ${
                    isCurrent ? 'h-7 w-7' : ''
                  }`}
                >
                  {isCurrent && (
                    <span className="text-xs font-bold text-lettertext">
                      {score}
                    </span>
                  )}
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