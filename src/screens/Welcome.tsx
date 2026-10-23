import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Button } from '../components/Button';
import { ChevronRight } from 'lucide-react';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  renderGraphic: () => React.ReactNode;
}

export const Welcome: React.FC = () => {
  const { navigateTo } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: Slide[] = [
    {
      id: 0,
      title: 'Find your people',
      subtitle:
        'Connect with peers around mutual curiosity, shared problem spaces, and specialized craft.',
      renderGraphic: () => (
        <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-xl" />
          <svg viewBox="0 0 160 160" className="w-40 h-40">
            <defs>
              <linearGradient id="circGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4F46E5" />
                <stop offset="100%" stopColor="#7C3AED" />
              </linearGradient>
              <linearGradient id="circGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7C3AED" />
                <stop offset="100%" stopColor="#F0607A" />
              </linearGradient>
            </defs>
            <circle cx="60" cy="80" r="42" fill="url(#circGrad1)" opacity="0.85" />
            <circle cx="100" cy="80" r="42" fill="url(#circGrad2)" opacity="0.85" style={{ mixBlendMode: 'screen' }} />
            <circle cx="80" cy="80" r="14" fill="#FFFFFF" opacity="0.9" />
          </svg>
        </div>
      ),
    },
    {
      id: 1,
      title: 'Match on what matters',
      subtitle:
        'Discover peers through shared interests and complementary goals, not vanity follower counts.',
      renderGraphic: () => (
        <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-purple-500/20 via-pink-500/20 to-indigo-500/20 blur-xl" />
          <svg viewBox="0 0 160 160" className="w-40 h-40">
            <defs>
              <linearGradient id="rayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7C3AED" />
                <stop offset="100%" stopColor="#F0607A" />
              </linearGradient>
            </defs>
            {/* Concentric orbital rings */}
            <circle cx="80" cy="80" r="54" stroke="url(#rayGrad)" strokeWidth="2" strokeDasharray="6 4" fill="none" opacity="0.6" />
            <circle cx="80" cy="80" r="36" stroke="#4F46E5" strokeWidth="2" fill="none" opacity="0.7" />
            <circle cx="80" cy="80" r="18" fill="url(#rayGrad)" />
            <circle cx="116" cy="60" r="8" fill="#4F46E5" />
            <circle cx="44" cy="100" r="6" fill="#F0607A" />
          </svg>
        </div>
      ),
    },
    {
      id: 2,
      title: 'Grow together',
      subtitle:
        'Direct, private conversations that lead to meaningful collaborations, mentorship, and ventures.',
      renderGraphic: () => (
        <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500/20 via-pink-500/20 to-amber-500/20 blur-xl" />
          <svg viewBox="0 0 160 160" className="w-40 h-40">
            <defs>
              <linearGradient id="barGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#4F46E5" />
                <stop offset="50%" stopColor="#7C3AED" />
                <stop offset="100%" stopColor="#F0607A" />
              </linearGradient>
            </defs>
            <rect x="36" y="74" width="18" height="54" rx="9" fill="#4F46E5" opacity="0.8" />
            <rect x="62" y="52" width="18" height="76" rx="9" fill="#7C3AED" opacity="0.9" />
            <rect x="88" y="32" width="18" height="96" rx="9" fill="#9333EA" opacity="0.9" />
            <rect x="114" y="20" width="18" height="108" rx="9" fill="url(#barGrad)" />
          </svg>
        </div>
      ),
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigateTo('auth');
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-6 bg-white dark:bg-[#0B1020] text-slate-900 dark:text-white select-none overflow-y-auto no-scrollbar">
      {/* Top Header / Skip */}
      <div className="flex items-center justify-between pt-2">
        <span className="font-display font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
          Meridian
        </span>
        <button
          type="button"
          onClick={() => navigateTo('auth')}
          className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          Skip
        </button>
      </div>

      {/* Slide Content */}
      <div className="my-auto py-6 flex flex-col items-center text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="flex flex-col items-center space-y-6"
          >
            {slides[currentSlide].renderGraphic()}

            <div className="space-y-2.5 max-w-xs">
              <h2 className="font-display font-bold text-2xl tracking-tight text-slate-900 dark:text-white">
                {slides[currentSlide].title}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                {slides[currentSlide].subtitle}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel indicators */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                currentSlide === idx
                  ? 'w-6 bg-gradient-to-r from-indigo-500 to-pink-500'
                  : 'w-1.5 bg-slate-300 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Action Area */}
      <div className="space-y-3 pt-2">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => navigateTo('auth')}
        >
          Create account
        </Button>

        <Button
          variant="secondary"
          size="md"
          fullWidth
          onClick={() => navigateTo('auth')}
        >
          I already have an account
        </Button>
      </div>
    </div>
  );
};
