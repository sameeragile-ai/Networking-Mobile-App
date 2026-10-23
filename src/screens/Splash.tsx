import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

export const Splash: React.FC = () => {
  const { navigateTo } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigateTo('welcome');
    }, 1800);
    return () => clearTimeout(timer);
  }, [navigateTo]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#4F46E5] via-[#7C3AED] to-[#F0607A] text-white p-6 overflow-hidden select-none">
      {/* Background radial shimmer */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.35, scale: 1.2 }}
        transition={{ duration: 1.8, ease: 'easeOut' }}
        className="absolute w-96 h-96 rounded-full bg-white/20 blur-3xl pointer-events-none"
      />

      <div className="relative z-10 flex flex-col items-center text-center space-y-3">
        <motion.h1
          initial={{ opacity: 0, y: 15, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-extrabold text-4xl sm:text-5xl tracking-tight"
        >
          Meridian
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-sm font-medium text-white/90 tracking-wide max-w-xs"
        >
          Meet people who care about what you care about.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="absolute bottom-10 flex flex-col items-center gap-2"
      >
        <div className="w-6 h-1 rounded-full bg-white/40 overflow-hidden">
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-full h-full bg-white rounded-full"
          />
        </div>
      </motion.div>
    </div>
  );
};
