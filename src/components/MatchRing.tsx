import React, { useEffect, useState } from 'react';

interface MatchRingProps {
  score: number; // 0 to 100
  size?: number; // diameter in px
  strokeWidth?: number;
  showLabel?: boolean;
  className?: string;
}

export const MatchRing: React.FC<MatchRingProps> = ({
  score,
  size = 46,
  strokeWidth = 3.5,
  showLabel = false,
  className = '',
}) => {
  const [displayedScore, setDisplayedScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 800; // ms
    const stepTime = 16;
    const totalSteps = duration / stepTime;
    const stepIncrement = score / totalSteps;

    const timer = setInterval(() => {
      start += stepIncrement;
      if (start >= score) {
        setDisplayedScore(score);
        clearInterval(timer);
      } else {
        setDisplayedScore(Math.round(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayedScore / 100) * circumference;

  // Gradient ID unique per score to avoid SVG clashes
  const gradientId = `match-grad-${score}-${size}`;

  return (
    <div className={`inline-flex flex-col items-center ${className}`}>
      <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4F46E5" />
              <stop offset="60%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#F0607A" />
            </linearGradient>
          </defs>

          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-100 dark:text-slate-800"
            fill="transparent"
          />

          {/* Animated Value Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              transition: 'stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
        </svg>

        {/* Center score percentage */}
        <div className="absolute inset-0 flex items-center justify-center font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
          <span style={{ fontSize: Math.max(10, Math.round(size * 0.28)) }}>
            {displayedScore}%
          </span>
        </div>
      </div>

      {showLabel && (
        <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-500 dark:text-slate-400 mt-1">
          Match
        </span>
      )}
    </div>
  );
};
