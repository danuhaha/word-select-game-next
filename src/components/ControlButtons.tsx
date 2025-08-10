import React from 'react';
import { LuRefreshCcw } from 'react-icons/lu';

interface ControlButtonsProps {
  onClear: () => void;
  onBackspace: () => void;
  onSubmit: () => void;
  selectedLettersCount: number;
  onShuffle?: () => void;
}

const ControlButtons: React.FC<ControlButtonsProps> = ({ onClear, onBackspace, onSubmit, selectedLettersCount, onShuffle }) => (
  <div className='w-full overflow-x-auto'>
    <div className='mx-auto flex w-fit flex-nowrap justify-center gap-1 xs:gap-2'>
      {onShuffle && (
        <button
          onClick={onShuffle}
          aria-label={'Перемешать'}
          className={'flex items-center justify-center rounded-full border border-primary px-4 py-3 text-xs font-medium xxs:text-sm xs:text-base'}
        >
          <LuRefreshCcw />
        </button>
      )}
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
  </div>
);

export default ControlButtons;
