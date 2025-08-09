import React from 'react';

interface PopupProps {
  readonly message: string;
}

export const Popup = (props: PopupProps) => {
  if (!props.message) {
    return null;
  }

  return (
    <div className='pointer-events-none absolute left-1/2 top-1/2 z-[1000] w-fit -translate-x-1/2 -translate-y-1/2 rounded-lg bg-stone-500 bg-opacity-70 px-2 py-0.5 text-center text-base leading-tight text-white dark:bg-neutral-400 sm:text-lg'>
      {props.message}
    </div>
  );
};
