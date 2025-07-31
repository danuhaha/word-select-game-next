'use client';

import React from 'react';

interface RankSystemProps {
  score: number;
  maxPossibleScore: number;
}

const RankSystem: React.FC<RankSystemProps> = ({ score, maxPossibleScore }) => {
  const ranks = [
    { name: 'Новичок', minPercentage: 0, color: 'text-gray-400' },
    { name: 'Хорошее начало', minPercentage: 2, color: 'text-lime-400' },
    { name: 'Разогрев', minPercentage: 5, color: 'text-pink-400' },
    { name: 'Неплохо', minPercentage: 8, color: 'text-cyan-400' },
    { name: 'Хорошо', minPercentage: 15, color: 'text-orange-400' },
    { name: 'Отлично', minPercentage: 25, color: 'text-green-400' },
    { name: 'Мастер', minPercentage: 40, color: 'text-blue-400' },
    { name: 'Профессионал', minPercentage: 50, color: 'text-purple-400' },
    { name: 'Гений', minPercentage: 70, color: 'text-yellow-400' },
    { name: 'Сверхразум', minPercentage: 100, color: 'text-red-400' },
  ];

  // Calculate percentage of points achieved
  const scorePercentage = maxPossibleScore > 0 ? Math.round((score / maxPossibleScore) * 100) : 0;
  
  // Find current rank based on percentage
  const currentRank = [...ranks].reverse().find(rank => scorePercentage >= rank.minPercentage) || ranks[0];
  
  // Calculate the position of the current rank circle (as percentage of total width)
  const currentRankIndex = ranks.findIndex(rank => rank.name === currentRank.name);
  const progressLineWidth = currentRankIndex === 0 ? 0 : (currentRankIndex / (ranks.length - 1)) * 100;
  
  return (
    
      <div className="flex items-center ">
        {/* Current rank name on the left */}
        <div className="flex-shrink-0 min-w-[120px]">
          <h2 className="ml-2 text-lg sm:text-xl font-bold text-red">
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
              const isAchieved = scorePercentage >= rank.minPercentage;
              const isCurrent = rank.name === currentRank.name;
              
              return (
                <div
                  key={rank.name}
                  className="relative flex flex-col items-center group"
                  style={{ left: index === 0 ? '0' : index === ranks.length - 1 ? 'auto' : 'auto' }}
                >
                            <div
                            className={`w-2 h-2  bg-cell-deselected rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
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
                            
                            {/* Tooltip on hover */}
                  {/* <div className="absolute bottom-full mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
                    {rank.name}: {rank.minPercentage}%
                  </div> */}
                </div>
              );
            })}
          </div>
        </div>
      </div>
  );
};

export default RankSystem;