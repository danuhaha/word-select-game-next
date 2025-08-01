import React from 'react';

interface PlayButtonProps {
  onStart: () => void;
}

const PlayButton: React.FC<PlayButtonProps> = ({ onStart }) => (
  <button
    onClick={onStart}
    className='rounded-full border border-primary px-4 py-3 text-xs font-medium xxs:text-sm xs:text-base'
  >
    Играть
  </button>
);

export default PlayButton;
