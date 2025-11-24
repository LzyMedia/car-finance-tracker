import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-2 bg-surface border border-white/10 rounded-lg text-foreground placeholder-muted focus:outline-none focus:border-jdm-purple focus:ring-1 focus:ring-jdm-purple transition-all ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-jdm-red">{error}</p>
      )}
    </div>
  );
};
