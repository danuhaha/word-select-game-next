'use client';

import React, { useState } from 'react';
import Game from '@/components/Game';
import RankSystem from '@/components/RankSystem';
import { FaFire, FaRegQuestionCircle, FaRegUserCircle } from 'react-icons/fa';
import { LuMenu, LuMoon, LuSun } from 'react-icons/lu';
import { useTheme } from 'next-themes';
import { Modal, useModal } from '@/components/Modal';
import { GameRulesModal } from '@/components/GameRulesModal';

export default function Home() {
  const [score, setScore] = useState<number>(0);
  const [maxPossibleScore, setMaxPossibleScore] = useState<number>(0);
  const [key] = useState<number>(1);
  const { theme, setTheme } = useTheme();
  const [dialogProps, showModal] = useModal();

  const setScoreHandler = (newScore: number) => {
    setScore(newScore);
  };

  const setMaxPossibleScoreHandler = (maxScore: number) => {
    setMaxPossibleScore(maxScore);
  };

  // This function receives valid words from the Game component, but we don't need to store them

  const getDataHandler = () => {
    // We're not using the valid words list in this component
  };

  return (
    <div className='min-h-screen bg-background text-primary'>
      <Modal {...dialogProps} />
      <main className='flex min-h-screen flex-col'>
        <div className='relative mx-auto mt-2 flex w-11/12 items-center justify-between md:w-full 3xl:w-7/12'>
          <div className='flex items-center'>
            <FaFire
              className='invisible mr-0.5 text-streak'
              size={23}
            />
          </div>

          <div className='flex items-center'>
            <button
              className='mx-2'
              onClick={() => showModal(<GameRulesModal />)}
            >
              <FaRegQuestionCircle size={25} />
            </button>
            <button
              className='relative mr-2'
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              <LuMoon
                size={25}
                className='absolute scale-100 transition-transform duration-200 dark:scale-0'
              />
              <LuSun
                size={25}
                className='scale-0 transition-transform duration-200 dark:scale-100'
              />
            </button>
            {/*<FaRegUserCircle size={25} />*/}
            {/*<LuMenu*/}
            {/*  size={28}*/}
            {/*  className='float-right ml-2 md:mr-4 3xl:mr-0'*/}
            {/*/>*/}
          </div>
        </div>
        <div className='relative mx-auto flex w-11/12 flex-1 flex-col items-center md:w-3/4 lg:w-7/12'>
          <div className='mb-2 mt-4 flex items-center'>
            <h1 className='text-4xl font-semibold'>Слова</h1>
          </div>

          <div className='mx-auto mb-4 w-full'>
            <RankSystem
              score={score}
              maxPossibleScore={maxPossibleScore}
            />
          </div>
          {/* <hr className='border-cell-deselected mb-4 md:mb-4 w-full' /> */}

          <Game
            key={key}
            wordLength={15}
            getData={getDataHandler}
            setScore={setScoreHandler}
            setMaxPossibleScore={setMaxPossibleScoreHandler}
          />
        </div>
        <div className='my-2 mb-4 flex items-center justify-center'>
          <div className='text-center text-xxs text-secondary'>
            <a
              href='/terms'
              target='_blank'
              rel='noopener noreferrer'
            >
              Пользовательское соглашение
            </a>
            <br />
            <a
              href='/policy'
              target='_blank'
              rel='noopener noreferrer'
            >
              Политика конфиденциальности
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
