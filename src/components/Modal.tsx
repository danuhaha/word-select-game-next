import React, { type MouseEventHandler, type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { IoClose } from 'react-icons/io5';

interface ModalProps {
  readonly closeModal: () => void;
  readonly content: React.ReactNode; // Dynamic content passed to modal
}

export const useModal = () => {
  const [content, setContent] = useState<ReactNode>(null);

  const showModal = useCallback((modalContent: ReactNode) => {
    setContent(modalContent);
  }, []);

  const closeModal = useCallback(() => {
    setContent(null); // Clear content on close
  }, []);

  return [{ content, closeModal }, showModal] as const;
};

export const Modal = ({ closeModal, content }: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const handleModalClickOutside: MouseEventHandler<HTMLDialogElement> = useCallback(
    ({ currentTarget, target }) => {
      const isClickedOnBackdrop = target === currentTarget;

      if (isClickedOnBackdrop) {
        closeModal();
      }
    },
    [closeModal]
  );

  const dialogContent = useMemo(() => {
    if (!content) return null;

    return (
      <>
        <button
          onClick={closeModal}
          className='absolute right-2 top-2 text-2xl focus:outline-none focus:ring-0'
          aria-label='Close'
        >
          <IoClose />
        </button>
        {content}
      </>
    );
  }, [closeModal, content]);

  useEffect(() => {
    if (content) {
      if (!dialogRef.current?.open) dialogRef.current?.showModal();
      dialogRef.current?.scrollTo(0, 0);
    } else {
      if (dialogRef.current?.open) dialogRef.current?.close();
    }
  }, [content, dialogRef]);

  useEffect(() => {
    closeModal();
  }, [closeModal]);

  return (
    <dialog
      ref={dialogRef}
      className={'rounded-md bg-background text-primary backdrop:bg-black backdrop:opacity-75'}
      onClick={handleModalClickOutside}
      onClose={closeModal}
    >
      <div className='relative flex flex-col items-center justify-center p-8 px-12'>{dialogContent}</div>
    </dialog>
  );
};
