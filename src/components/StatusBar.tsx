import React, { useState, useEffect } from 'react';
import { DeviceType } from '../types';
import { Wifi } from 'lucide-react';

interface StatusBarProps {
  deviceType: DeviceType;
  dark?: boolean;
}

export const StatusBar: React.FC<StatusBarProps> = ({ deviceType, dark = false }) => {
  const [time, setTime] = useState('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const formatted = `${hours % 12 || 12}:${minutes < 10 ? '0' : ''}${minutes}`;
      setTime(formatted);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const textColor = dark ? 'text-white' : 'text-slate-900 dark:text-white';

  if (deviceType === 'iphone') {
    return (
      <div className={`relative w-full h-11 px-7 flex items-center justify-between text-xs font-semibold select-none z-30 pointer-events-none transition-colors duration-200 ${textColor}`}>
        {/* Left: Time */}
        <span className="w-14 text-center tracking-tight font-medium tabular-nums">{time}</span>

        {/* Center: Dynamic Island */}
        <div className="absolute left-1/2 -translate-x-1/2 top-2.5 h-7 w-28 bg-black rounded-full shadow-inner flex items-center justify-between px-2.5 transition-all duration-300">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 ring-1 ring-slate-800" />
          <div className="w-2 h-2 rounded-full bg-[#111] ring-1 ring-indigo-900/40" />
        </div>

        {/* Right: Signal, Wifi, Battery */}
        <div className="flex items-center gap-1.5 w-14 justify-end">
          {/* Signal */}
          <div className="flex items-end gap-0.5 h-3">
            <span className="w-0.5 h-1 bg-current rounded-xs" />
            <span className="w-0.5 h-1.5 bg-current rounded-xs" />
            <span className="w-0.5 h-2 bg-current rounded-xs" />
            <span className="w-0.5 h-2.5 bg-current rounded-xs" />
          </div>
          {/* Wifi */}
          <Wifi className="w-3.5 h-3.5 stroke-[2.2]" />
          {/* Battery */}
          <div className="relative w-5 h-2.5 border border-current rounded-xs p-0.5 flex items-center">
            <div className="h-full w-3.5 bg-current rounded-xs" />
            <div className="absolute -right-1 top-0.5 w-0.5 h-1 bg-current rounded-r-xs" />
          </div>
        </div>
      </div>
    );
  }

  // Android Status Bar
  return (
    <div className={`relative w-full h-9 px-5 flex items-center justify-between text-xs font-medium select-none z-30 pointer-events-none transition-colors duration-200 ${textColor}`}>
      {/* Left: Time */}
      <span className="tabular-nums tracking-tight font-normal">{time}</span>

      {/* Center: Punch-hole camera */}
      <div className="absolute left-1/2 -translate-x-1/2 top-2 w-3.5 h-3.5 bg-black rounded-full ring-2 ring-slate-800 shadow-sm" />

      {/* Right: Icons */}
      <div className="flex items-center gap-2">
        <Wifi className="w-3 h-3 stroke-[2]" />
        {/* Signal */}
        <div className="flex items-end gap-0.5 h-2.5">
          <span className="w-0.5 h-1 bg-current rounded-xs" />
          <span className="w-0.5 h-1.5 bg-current rounded-xs" />
          <span className="w-0.5 h-2 bg-current rounded-xs" />
          <span className="w-0.5 h-2.5 bg-current rounded-xs" />
        </div>
        {/* Battery with percentage */}
        <div className="flex items-center gap-1 text-[11px] tabular-nums font-normal">
          <span>88%</span>
          <div className="relative w-4 h-2 border border-current rounded-xs p-0.5 flex items-center">
            <div className="h-full w-2.5 bg-current rounded-xs" />
          </div>
        </div>
      </div>
    </div>
  );
};
