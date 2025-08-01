import React from 'react';

const PlayAgainButton: React.FC = () => (
  <button
    onClick={() => window.location.reload()}
    className='rounded-full border border-primary px-4 py-3 text-xs font-medium xxs:text-sm xs:text-base'
  >
    Играть снова
  </button>
);

export default PlayAgainButton;
