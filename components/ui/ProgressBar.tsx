import React from 'react';

interface ProgressBarProps {
  current: number;
  target: number;
  className?: string;
  showLabel?: boolean;
  color?: 'purple' | 'pink' | 'cyan' | 'gradient';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  target,
  className = '',
  showLabel = true,
  color = 'gradient',
}) => {
  const percentage = Math.min((current / target) * 100, 100);

  const colorStyles = {
    purple: 'bg-jdm-purple',
    pink: 'bg-jdm-pink',
    cyan: 'bg-jdm-cyan',
    gradient: 'bg-gradient-to-r from-jdm-purple to-jdm-pink',
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="w-full bg-surface rounded-full h-3 overflow-hidden border border-white/10">
        <div
          className={`h-full ${colorStyles[color]} transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="mt-2 flex justify-between text-sm text-muted">
          <span>${current.toLocaleString()}</span>
          <span>${target.toLocaleString()}</span>
        </div>
      )}
    </div>
  );
};
