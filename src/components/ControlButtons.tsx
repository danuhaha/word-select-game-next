import React from 'react';

interface ControlButtonsProps {
  onClear: () => void;
  onBackspace: () => void;
  onSubmit: () => void;
  selectedLettersCount: number;
}

const ControlButtons: React.FC<ControlButtonsProps> = ({ onClear, onBackspace, onSubmit, selectedLettersCount }) => (
  <div className='flex flex-wrap justify-center gap-2'>
    <button
      onClick={onClear}
      disabled={selectedLettersCount === 0}
      className={`rounded-full border px-4 py-3 text-xs font-medium xxs:text-sm xs:text-base ${
        selectedLettersCount === 0 ? 'cursor-not-allowed border-secondary text-secondary' : 'cursor-pointer border-primary text-primary'
      }`}
    >
      Очистить
    </button>
    <button
      onClick={onBackspace}
      disabled={selectedLettersCount === 0}
      className={`rounded-full border px-4 py-3 text-xs font-medium xxs:text-sm xs:text-base ${
        selectedLettersCount === 0 ? 'cursor-not-allowed border-secondary text-secondary' : 'cursor-pointer border-primary text-primary'
      }`}
    >
      Стереть
    </button>
    <button
      onClick={onSubmit}
      disabled={selectedLettersCount < 4}
      className={`rounded-full border px-4 py-3 text-xs font-medium xxs:text-sm xs:text-base ${
        selectedLettersCount < 4
          ? 'cursor-not-allowed border-maincolormuted bg-background text-maincolormuted'
          : 'cursor-pointer border-maincolor bg-maincolor text-lettertext'
      }`}
    >
      Отправить
    </button>
  </div>
);

export default ControlButtons;
