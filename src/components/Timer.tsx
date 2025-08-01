'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';

interface TimerProps {
  seconds: number;
  setTimeHandler: (data: { total: number }) => void;
  onTimerEndHandler: () => void;
  shouldStart?: boolean; // New prop to control when timer starts
}

const Timer: React.FC<TimerProps> = ({ seconds, setTimeHandler, onTimerEndHandler, shouldStart = true }) => {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const [, setIsRunning] = useState(false); // Start as false
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastTickRef = useRef<number>(Date.now());

  const formatTime = useCallback((milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return {
      minutes: minutes < 10 ? `0${minutes}` : minutes.toString(),
      seconds: seconds < 10 ? `0${seconds}` : seconds.toString(),
    };
  }, []);

  const tick = useCallback(() => {
    setTimeLeft((prev) => {
      const newTime = Math.max(0, prev - 1000);
      setTimeHandler({ total: newTime });
      return newTime;
    });
  }, [setTimeHandler]);

  useEffect(() => {
    if (timeLeft === 0) {
      onTimerEndHandler();
    }
  }, [timeLeft, onTimerEndHandler]);

  const startTimer = useCallback(() => {
    if (intervalRef.current) return;

    intervalRef.current = setInterval(tick, 1000);
    lastTickRef.current = Date.now();
  }, [tick]);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Handle visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab became hidden - pause the timer
        setIsRunning(false);
        stopTimer();
      } else {
        // Tab became visible - resume the timer if it should be running
        if (shouldStart && timeLeft > 0) {
          setIsRunning(true);
          startTimer();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [timeLeft, startTimer, stopTimer, shouldStart]);

  // Start timer when shouldStart becomes true
  useEffect(() => {
    if (shouldStart && timeLeft > 0) {
      setIsRunning(true);
      startTimer();
    } else if (!shouldStart) {
      setIsRunning(false);
      stopTimer();
    }

    return () => stopTimer();
  }, [shouldStart, timeLeft, startTimer, stopTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopTimer();
  }, [stopTimer]);

  const { minutes, seconds: secs } = formatTime(timeLeft);

  return (
    <div className='flex items-center gap-2'>
      <span className=' '>
        Времени осталось{' '}
        <b>
          {minutes} : {secs}
        </b>
      </span>
    </div>
  );
};

export default Timer;
