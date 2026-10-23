import React from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

interface ChipProps {
  label: string;
  selected?: boolean;
  highlighted?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  size?: 'sm' | 'md';
  disabled?: boolean;
  className?: string;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  highlighted = false,
  onClick,
  onRemove,
  size = 'md',
  disabled = false,
  className = '',
}) => {
  const isInteractive = !!onClick && !disabled;

  return (
    <motion.button
      type="button"
      whileTap={isInteractive ? { scale: 0.94 } : undefined}
      whileHover={isInteractive ? { scale: 1.02 } : undefined}
      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
      onClick={isInteractive ? onClick : undefined}
      disabled={disabled}
      className={`relative inline-flex items-center gap-1.5 font-medium rounded-full transition-all duration-200 select-none whitespace-nowrap text-left ${
        size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3.5 py-1.5 text-xs sm:text-sm'
      } ${
        selected
          ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white shadow-xs'
          : highlighted
          ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-400/50 dark:ring-indigo-500/50'
          : 'bg-slate-100 dark:bg-[#1A2142] text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-[#252E58] ring-1 ring-slate-200/60 dark:ring-slate-700/40'
      } ${isInteractive ? 'cursor-pointer' : 'cursor-default'} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
    >
      {selected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
      <span>{label}</span>
      {onRemove && (
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 p-0.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full cursor-pointer transition-colors"
        >
          <X className="w-3 h-3" />
        </span>
      )}
    </motion.button>
  );
};
