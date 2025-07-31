'use client';

import React, { useState } from 'react';
import Game from '@/components/Game';
import RankSystem from '@/components/RankSystem';
import ThemeSwitcher from '@/components/ThemeSwitcher';

export default function Home() {
  const [score, setScore] = useState<number>(0);
  const [maxPossibleScore, setMaxPossibleScore] = useState<number>(0);
  const [key, setKey] = useState<number>(1);

  const setScoreHandler = (newScore: number) => {
    setScore(newScore);
  };

  const setMaxPossibleScoreHandler = (maxScore: number) => {
    setMaxPossibleScore(maxScore);
  };

  // This function receives valid words from the Game component but we don't need to store them
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getDataHandler = (validWordsList: string[]) => {
    // We're not using the valid words list in this component
  };

  return (
    <div className="min-h-screen bg-background text-primary">
      <ThemeSwitcher />
      <main>
      <div className='flex-1 flex flex-col items-center w-11/12 md:w-3/4 lg:w-7/12 mx-auto  relative'>
          <div className='flex items-center my-4'>
            <h1 className=' text-4xl font-semibold'>Слова</h1>
          </div>

          <div className="mb-5 mx-auto  w-full">
            <RankSystem score={score} maxPossibleScore={maxPossibleScore} />
          </div>
          {/* <hr className=' border-cell-deselected mb-4 md:mb-4 w-full' /> */}
          
        <Game 
          key={key}
          wordLength={15}
          getData={getDataHandler}
          setScore={setScoreHandler}
          setMaxPossibleScore={setMaxPossibleScoreHandler}
        />
        
        </div>
      </main>
    </div>
  );
}
