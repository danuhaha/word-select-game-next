'use client';

import React, { useState } from 'react';
import RussianGame from '@/components/RussianGame';
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
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
          <div className="mb-4 sm:mb-6">
            <RankSystem score={score} maxPossibleScore={maxPossibleScore} />
          </div>
        </div>
        <RussianGame 
          key={key}
          wordLength={15}
          getData={getDataHandler}
          setScore={setScoreHandler}
          setMaxPossibleScore={setMaxPossibleScoreHandler}
        />
      </main>
    </div>
  );
}
