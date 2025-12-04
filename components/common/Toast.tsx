
import React, { useEffect } from 'react';
import { Icon } from './Icon';
import type { IconName } from './Icon';

interface ToastProps {
  message: string;
  type: 'info' | 'error';
  onClose: () => void;
  isOpen: boolean;
}

const toastConfig = {
  info: {
    icon: 'wifi' as IconName,
    bg: 'bg-primary',
  },
  error: {
    icon: 'wifi-off' as IconName,
    bg: 'bg-red-600',
  },
};

export const Toast: React.FC<ToastProps> = ({ message, type, onClose, isOpen }) => {
  useEffect(() => {
    if (isOpen && type === 'info') {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, type, onClose]);

  const config = toastConfig[type];

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <div className={`flex items-center text-white p-3 sm:p-4 rounded-lg shadow-lg ${config.bg}`}>
        <Icon name={config.icon} className="w-6 h-6 mr-3 flex-shrink-0" />
        <span className="text-sm sm:text-base">{message}</span>
        <button onClick={onClose} className="ml-4 text-white hover:bg-white/20 p-1 rounded-full flex-shrink-0">
          <Icon name="close" className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
