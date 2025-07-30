'use client';

import React, { ReactNode } from 'react';

interface ModalProps {
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ children }) => {
  return (
    <div 
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                 border border-blue-700 shadow-2xl rounded-lg z-50 p-6 max-w-md w-full bg-gray-800"
    >
      {children}
    </div>
  );
};

export default Modal;
