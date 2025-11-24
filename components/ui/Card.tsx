import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  gradient = false,
}) => {
  const baseStyles = 'bg-surface-elevated rounded-xl p-6 border border-white/10';
  const hoverClass = hover ? 'card-hover cursor-pointer' : '';
  const gradientClass = gradient ? 'gradient-border' : '';

  return (
    <div className={`${baseStyles} ${hoverClass} ${gradientClass} ${className}`}>
      {children}
    </div>
  );
};
