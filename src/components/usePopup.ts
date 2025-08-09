'use client';
import { useCallback, useRef, useState } from 'react';

const POPUP_TIMEOUT = 1500;

export const usePopup = () => {
  const [popupContent, setPopupContent] = useState('');
  const timeoutID = useRef<number | null>(null);

  const showPopup = useCallback((message: string) => {
    if (timeoutID.current) {
      clearTimeout(timeoutID.current);
    }
    setPopupContent(message);

    timeoutID.current = window.setTimeout(() => {
      setPopupContent('');
    }, POPUP_TIMEOUT);
  }, []);

  return [popupContent, showPopup] as const;
};
