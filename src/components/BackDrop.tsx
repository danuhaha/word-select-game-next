'use client';

import React from 'react';

interface BackDropProps {
  onClick: () => void;
}

const BackDrop: React.FC<BackDropProps> = ({ onClick }) => {
  return (
    <div
      onClick={onClick}
      className='fixed inset-0 z-40 bg-black bg-opacity-70'
    />
  );
};

export default BackDrop;
