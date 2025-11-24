import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  glow = false,
  className = '',
  children,
  ...props
}) => {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: 'bg-gradient-to-r from-jdm-purple to-jdm-pink text-white hover:shadow-lg',
    secondary: 'bg-surface-elevated text-foreground hover:bg-opacity-80',
    outline: 'border-2 border-jdm-purple text-jdm-purple hover:bg-jdm-purple hover:text-white',
    ghost: 'text-jdm-purple hover:bg-surface-elevated',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const glowClass = glow ? 'neon-purple' : '';

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${glowClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
