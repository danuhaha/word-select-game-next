'use client';

import React, { useEffect, useState } from 'react';
import { getDynamicRankThresholds } from '@/utils/rank';

interface RankSystemProps {
  score: number;
  maxPossibleScore: number;
  initialWord: string;
}

// thresholds are provided by utils/rank

const RankSystem: React.FC<RankSystemProps> = ({ score, maxPossibleScore, initialWord }) => {
  const [ranks, setRanks] = useState<Array<{ name: string; minPoints: number }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if we have a valid word - be more lenient with the check
    if (!initialWord || typeof initialWord !== 'string' || initialWord.length === 0) {
      setIsLoading(true);
      return;
    }

    // Calculate ranks when word is available
    const calculatedRanks = getDynamicRankThresholds(maxPossibleScore, initialWord);
    setRanks(calculatedRanks);
    setIsLoading(false);
  }, [initialWord, maxPossibleScore]);

  // Compute current rank (may be undefined while loading)
  const currentRank = ranks.length > 0 ? [...ranks].reverse().find((rank) => score >= rank.minPoints) || ranks[0] : undefined;
  const currentRankIndex = currentRank ? ranks.findIndex((rank) => rank.name === currentRank.name) : 0;
  const progressLineWidth = currentRank && ranks.length > 1 ? (currentRankIndex === 0 ? 0 : (currentRankIndex / (ranks.length - 1)) * 100) : 0;

  // Show skeleton while loading
  if (isLoading) {
    return (
      <div className='flex h-7 items-center'>
        {/* Skeleton for rank name */}
        <div className='min-w-[10ch] flex-shrink-0'>
          <div className='w-26 ml-2 mr-2 h-[28px] animate-pulse rounded bg-cell-deselected sm:h-7 sm:w-32'></div>
        </div>
        {/* Skeleton for progress line */}
        <div className='relative mr-2 flex-1'>
          <div className='absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 transform animate-pulse rounded-full bg-cell-deselected' />
          <div className='relative flex h-7 items-center justify-between'>
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className='h-2 w-2 animate-pulse rounded-full bg-cell-deselected'
                style={{ animationDelay: `${index * 0.1}s` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex h-7 items-center'>
      {/* Current rank name on the left */}
      <div className='min-w-[10ch] flex-shrink-0'>
        <h2 className='text-red ml-2 mr-2 text-lg font-bold leading-7 sm:text-xl'>
          {currentRank?.name || ''}
        </h2>
      </div>
      {/* Progress line with circular markings */}
      <div className='relative mr-2 flex-1'>
        <div className='absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 transform rounded-full bg-cell-deselected' />
        <div
          className='absolute left-0 top-1/2 h-px -translate-y-1/2 transform rounded-full bg-maincolor transition-all duration-500 ease-out'
          style={{ width: `${progressLineWidth}%` }}
        />
        <div className='relative flex h-7 items-center justify-between'>
          {ranks.map((rank, index) => {
            const isAchieved = score >= rank.minPoints;
            const isCurrent = rank.name === currentRank?.name;
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
