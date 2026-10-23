import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 max-w-xs mx-auto space-y-4 ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center ring-1 ring-indigo-100 dark:ring-indigo-900/50">
        <Icon className="w-6 h-6 stroke-[1.8]" />
      </div>

      <div className="space-y-1.5">
        <h4 className="font-display font-semibold text-base text-slate-900 dark:text-white">
          {title}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {description}
        </p>
      </div>

      {actionLabel && onAction && (
        <div className="pt-2 w-full">
          <Button variant="secondary" size="sm" fullWidth onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
