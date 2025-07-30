'use client';

import React from 'react';

interface RankSystemProps {
  score: number;
  maxPossibleScore: number;
}

const RankSystem: React.FC<RankSystemProps> = ({ score, maxPossibleScore }) => {
  const ranks = [
    { name: 'Сверхразум', minPercentage: 100, color: 'text-red-400', isHidden: true },
    { name: 'Гений', minPercentage: 70, color: 'text-yellow-400' },
    { name: 'Профессионал', minPercentage: 50, color: 'text-purple-400' },
    { name: 'Мастер', minPercentage: 40, color: 'text-blue-400' },
    { name: 'Отлично', minPercentage: 25, color: 'text-green-400' },
    { name: 'Хорошо', minPercentage: 15, color: 'text-orange-400' },
    { name: 'Неплохо', minPercentage: 8, color: 'text-cyan-400' },
    { name: 'Разогрев', minPercentage: 5, color: 'text-pink-400' },
    { name: 'Хорошее начало', minPercentage: 2, color: 'text-lime-400' },
    { name: 'Новичок', minPercentage: 0, color: 'text-gray-400' },
  ];

  // Calculate percentage of points achieved
  const scorePercentage = maxPossibleScore > 0 ? Math.round((score / maxPossibleScore) * 100) : 0;
  
  // Find current rank based on percentage
  const currentRank = ranks.find(rank => scorePercentage >= rank.minPercentage) || ranks[ranks.length - 1];
  
  // Find next rank (excluding hidden ranks unless current is hidden)
  const visibleRanks = currentRank.isHidden ? ranks : ranks.filter(rank => !rank.isHidden);
  const currentRankIndex = visibleRanks.findIndex(rank => rank.name === currentRank.name);
  const nextRank = currentRankIndex > 0 ? visibleRanks[currentRankIndex - 1] : null;
  
  // Calculate points needed for next rank
  const pointsToNext = nextRank ? Math.ceil((nextRank.minPercentage / 100) * maxPossibleScore) - score : 0;
  const pointsToGenius = Math.ceil((70 / 100) * maxPossibleScore) - score;

  return (
    <div className="rounded-lg p-3 sm:p-4 shadow-lg bg-background">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 sm:gap-3">
          <h2 className={`text-lg sm:text-2xl font-bold text-primary`}>
            {currentRank.name}
          </h2>
          <div className="px-2 sm:px-3 py-1 rounded-full font-bold text-sm sm:text-base bg-maincolor text-lettertext">
            {score}
          </div>
        </div>
      </div>
      
      {nextRank && pointsToNext > 0 && (
        <div className="text-xs sm:text-sm text-primary">
          {pointsToNext} очков до {nextRank.name}{pointsToGenius > 0 ? `, ${pointsToGenius} до Гения` : ''}
        </div>
      )}
      
      {/* Progress bar */}
      <div className="mt-2 sm:mt-3 mb-2">
        <div className="w-full h-2 rounded-full bg-cell-deselected">
          <div 
            className="h-2 rounded-full transition-all duration-300 bg-maincolor"
            style={{ width: `${Math.min(scorePercentage, 100)}%` }}
          />
        </div>
      </div>
      
      {/* Progress dots visualization */}
      <div className="flex items-center gap-1">
        {visibleRanks.slice().reverse().map((rank, index) => (
          <div
            key={rank.name}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
              scorePercentage >= rank.minPercentage ? 'bg-maincolor' : 'bg-cell-deselected'
            }`}
            title={`${rank.name}: ${rank.minPercentage}% (${Math.ceil((rank.minPercentage / 100) * maxPossibleScore)} очков)`}
          />
        ))}
      </div>
    </div>
  );
};

export default RankSystem;