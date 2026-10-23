import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rounded';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rounded',
}) => {
  const variantStyles = {
    text: 'h-4 w-full rounded-sm',
    circular: 'rounded-full',
    rounded: 'rounded-2xl',
  };

  return (
    <div
      className={`animate-pulse bg-slate-200/80 dark:bg-slate-800/80 ${variantStyles[variant]} ${className}`}
    />
  );
};

export const DiscoverCardSkeleton: React.FC = () => {
  return (
    <div className="w-full bg-white dark:bg-[#121833] rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton variant="circular" className="w-14 h-14" />
          <div className="space-y-1.5">
            <Skeleton className="w-32 h-4" />
            <Skeleton className="w-24 h-3" />
          </div>
        </div>
        <Skeleton variant="circular" className="w-10 h-10" />
      </div>
      <div className="space-y-2 pt-2">
        <Skeleton className="w-full h-3" />
        <Skeleton className="w-4/5 h-3" />
      </div>
      <div className="flex gap-2 pt-1">
        <Skeleton className="w-20 h-6 rounded-full" />
        <Skeleton className="w-24 h-6 rounded-full" />
      </div>
      <div className="pt-2 flex gap-3">
        <Skeleton className="h-11 flex-1 rounded-xl" />
        <Skeleton className="h-11 w-11 rounded-xl" />
      </div>
    </div>
  );
};
