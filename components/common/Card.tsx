
import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  const combinedClassName = `bg-white rounded-xl shadow-sm border border-neutral-200 ${className}`;
  return (
    <div className={combinedClassName}>
      {children}
    </div>
  );
};
