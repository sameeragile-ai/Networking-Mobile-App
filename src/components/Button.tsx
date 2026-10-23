import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const sizeStyles = {
    sm: 'h-9 px-3.5 text-xs rounded-xl min-h-[38px]',
    md: 'h-11 px-5 text-sm rounded-xl min-h-[44px]',
    lg: 'h-13 px-6 text-base rounded-2xl min-h-[48px]',
  };

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#F0607A] text-white font-medium shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:brightness-105 active:brightness-95 border-0',
    secondary:
      'bg-slate-100 dark:bg-[#1A2142] text-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-[#252E58] border border-slate-200/80 dark:border-slate-700/60 font-medium',
    ghost:
      'bg-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium border-0',
    danger:
      'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 border border-rose-200/80 dark:border-rose-900/40 font-medium',
  };

  return (
    <motion.button
      type={type}
      whileTap={!disabled && !isLoading ? { scale: 0.97 } : undefined}
      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
        sizeStyles[size]
      } ${variantStyles[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...(props as any)}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
          <span className="opacity-90">Please wait...</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </motion.button>
  );
};
