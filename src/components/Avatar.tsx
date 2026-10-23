import React, { useState } from 'react';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  isOnline?: boolean;
  showOnline?: boolean;
  className?: string;
}

const SIZE_MAP = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-13 h-13 text-base',
  xl: 'w-16 h-16 text-lg',
  '2xl': 'w-22 h-22 text-2xl',
};

const DOT_SIZE_MAP = {
  xs: 'w-1.5 h-1.5 ring-1',
  sm: 'w-2 h-2 ring-1.5',
  md: 'w-2.5 h-2.5 ring-2',
  lg: 'w-3 h-3 ring-2',
  xl: 'w-3.5 h-3.5 ring-2',
  '2xl': 'w-4 h-4 ring-3',
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  isOnline = false,
  showOnline = false,
  className = '',
}) => {
  const [hasError, setHasError] = useState(false);

  // Generate consistent initials from name
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  // Subtle hash for deterministic gradient background if image fails
  const charCodeSum = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const gradients = [
    'from-indigo-600 to-violet-600',
    'from-violet-600 to-purple-600',
    'from-blue-600 to-indigo-600',
    'from-teal-600 to-emerald-600',
    'from-rose-500 to-pink-600',
  ];
  const bgGradient = gradients[charCodeSum % gradients.length];

  return (
    <div className={`relative inline-block shrink-0 ${className}`}>
      <div
        className={`${SIZE_MAP[size]} rounded-full overflow-hidden flex items-center justify-center font-medium select-none shadow-xs bg-slate-200 dark:bg-slate-800`}
      >
        {src && !hasError ? (
          <img
            src={src}
            alt={name}
            referrerPolicy="no-referrer"
            onError={() => setHasError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-tr ${bgGradient} text-white flex items-center justify-center font-semibold tracking-wider`}
          >
            {initials || 'M'}
          </div>
        )}
      </div>

      {showOnline && (
        <span
          className={`absolute bottom-0 right-0 rounded-full ring-white dark:ring-[#121833] ${
            DOT_SIZE_MAP[size]
          } ${isOnline ? 'bg-emerald-500' : 'bg-slate-400'}`}
          title={isOnline ? 'Online' : 'Offline'}
        />
      )}
    </div>
  );
};
