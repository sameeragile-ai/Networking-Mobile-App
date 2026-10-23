import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { DeviceType } from '../types';
import { StatusBar } from './StatusBar';
import { RotateCcw, Smartphone, Sun, Moon } from 'lucide-react';

interface DeviceFrameProps {
  deviceType: DeviceType;
  onChangeDeviceType: (type: DeviceType) => void;
  onResetDemo: () => void;
  isDarkTheme: boolean;
  onToggleTheme: () => void;
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
  deviceType,
  onChangeDeviceType,
  onResetDemo,
  isDarkTheme,
  onToggleTheme,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Proportional scaling for desktop viewport
  useEffect(() => {
    const handleResize = () => {
      if (typeof window === 'undefined') return;
      // Logical size: 390 x 844, plus phone bezel ~24px -> ~870px
      const availableHeight = window.innerHeight - 80; // headroom
      const naturalHeight = 868;
      const computedScale = Math.min(1, Math.max(0.65, availableHeight / naturalHeight));
      setScale(computedScale);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isIphone = deviceType === 'iphone';
  const cornerRadius = isIphone ? 'rounded-[54px]' : 'rounded-[44px]';

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0B1020] text-slate-100 flex flex-col md:flex-row items-center justify-between font-sans">
      {/* Background Animated Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{
            x: [0, 40, -30, 0],
            y: [0, -50, 30, 0],
            scale: [1, 1.15, 0.95, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-32 -left-32 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-indigo-600/25 via-violet-600/20 to-transparent blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -50, 40, 0],
            y: [0, 60, -40, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/3 -right-32 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-pink-600/20 via-purple-600/15 to-transparent blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 30, -40, 0],
            y: [0, -30, 40, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-40 left-1/4 w-[650px] h-[650px] rounded-full bg-gradient-to-tr from-blue-700/20 via-indigo-600/15 to-transparent blur-3xl"
        />
        <div className="absolute inset-0 bg-noise opacity-40" />
      </div>

      {/* DESKTOP LEFT BRAND PANEL */}
      <div className="hidden md:flex flex-col justify-between w-full md:w-[420px] lg:w-[480px] xl:w-[540px] h-full p-10 lg:p-14 z-10 shrink-0 pointer-events-auto">
        <div className="space-y-6">
          {/* Wordmark */}
          <div>
            <span className="text-xs uppercase tracking-widest text-indigo-400 font-semibold">
              Interactive Prototype
            </span>
            <h1 className="font-display font-extrabold text-4xl lg:text-5xl tracking-tight text-white mt-1">
              Meridian
            </h1>
          </div>

          {/* Tagline */}
          <p className="text-lg lg:text-xl font-medium text-slate-300 leading-snug max-w-sm">
            Meet people who care about what you care about.
          </p>

          {/* 3 Core Value Props */}
          <div className="space-y-3.5 pt-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-indigo-400" />
              <span className="text-sm text-slate-300 font-normal">
                Smart matching by shared professional interests
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-purple-400" />
              <span className="text-sm text-slate-300 font-normal">
                Private one-to-one contextual messaging
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-pink-400" />
              <span className="text-sm text-slate-300 font-normal">
                Built exclusively for thoughtful professionals
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Utility Controls */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onResetDemo}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
              <span>Reset demo state</span>
            </button>

            <button
              type="button"
              onClick={onToggleTheme}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 transition-colors cursor-pointer"
            >
              {isDarkTheme ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Light theme</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Dark theme</span>
                </>
              )}
            </button>
          </div>

          <span className="text-slate-500 font-mono text-[11px]">390 × 844 px</span>
        </div>
      </div>

      {/* DESKTOP CENTER/RIGHT PHONE FRAME CONTAINER */}
      <div
        ref={containerRef}
        className="hidden md:flex flex-1 h-full items-center justify-center p-4 z-10 overflow-hidden"
      >
        <div className="flex flex-col items-center">
          {/* Segmented Device Switcher */}
          <div className="mb-4 inline-flex items-center p-1 bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-700/70 shadow-lg text-xs font-medium">
            <button
              type="button"
              onClick={() => onChangeDeviceType('iphone')}
              className={`px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                isIphone
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xs font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>iPhone</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeDeviceType('android')}
              className={`px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                !isIphone
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xs font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Android</span>
            </button>
          </div>

          {/* PHYSICAL PHONE FRAME */}
          <div
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'top center',
            }}
            className="transition-transform duration-150"
          >
            <div
              className={`relative w-[390px] h-[844px] bg-slate-950 p-[12px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.12),inset_0_0_0_2px_rgba(148,163,184,0.2)] ${cornerRadius} transition-all duration-300`}
            >
              {/* Left Physical Buttons (Mute, Volume Up, Volume Down) */}
              <div className="absolute -left-[14px] top-28 w-[3px] h-7 bg-slate-700 rounded-l-md" />
              <div className="absolute -left-[14px] top-42 w-[3px] h-12 bg-slate-700 rounded-l-md" />
              <div className="absolute -left-[14px] top-58 w-[3px] h-12 bg-slate-700 rounded-l-md" />

              {/* Right Physical Button (Power / Siri) */}
              <div className="absolute -right-[14px] top-40 w-[3px] h-16 bg-slate-700 rounded-r-md" />

              {/* Screen Inner Viewport (390 x 844 logical space) */}
              <div
                className={`relative w-full h-full overflow-hidden ${cornerRadius} flex flex-col ${
                  isDarkTheme ? 'dark bg-[#0B1020] text-slate-100' : 'bg-[#F7F8FC] text-slate-900'
                }`}
              >
                {/* Status Bar */}
                <StatusBar deviceType={deviceType} dark={isDarkTheme} />

                {/* App Screen Content */}
                <div className="relative flex-1 w-full overflow-hidden flex flex-col">
                  {children}
                </div>

                {/* Home Indicator Bar */}
                <div className="relative w-full h-6 flex items-center justify-center pointer-events-none pb-1 bg-transparent">
                  <div className="w-32 h-1 rounded-full bg-slate-400/40 dark:bg-slate-600/40" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* REAL MOBILE FULL SCREEN RENDER (viewport < 768px) */}
      <div
        className={`md:hidden fixed inset-0 w-full h-[100dvh] flex flex-col overflow-hidden z-20 ${
          isDarkTheme ? 'dark bg-[#0B1020] text-slate-100' : 'bg-[#F7F8FC] text-slate-900'
        }`}
      >
        <StatusBar deviceType={deviceType} dark={isDarkTheme} />
        <div className="relative flex-1 w-full overflow-hidden flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
};
