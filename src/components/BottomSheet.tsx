import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxHeight?: string;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxHeight = 'max-h-[85%]',
}) => {
  // Prevent body scroll behind sheet if needed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end overflow-hidden">
          {/* Backdrop blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Sheet container */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.15}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100 || info.velocity.y > 400) {
                onClose();
              }
            }}
            className={`relative z-10 w-full ${maxHeight} bg-white dark:bg-[#121833] rounded-t-3xl shadow-2xl border-t border-slate-200/80 dark:border-slate-800 flex flex-col`}
          >
            {/* Grab Handle */}
            <div className="pt-3 pb-2 flex justify-center cursor-grab active:cursor-grabbing">
              <div className="w-10 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
            </div>

            {/* Header */}
            {title && (
              <div className="px-5 py-2.5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 shrink-0">
                <h3 className="font-display font-semibold text-base text-slate-900 dark:text-white">
                  {title}
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Content area with internal scrolling */}
            <div className="p-5 overflow-y-auto no-scrollbar flex-1 pb-safe">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
