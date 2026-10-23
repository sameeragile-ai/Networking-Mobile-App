import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastState } from '../context/AppContext';
import { CheckCircle2 } from 'lucide-react';

interface ToastProps {
  toast: ToastState | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute top-14 left-4 right-4 z-50 pointer-events-auto"
        >
          <div className="bg-slate-900/95 dark:bg-[#1A2142]/95 backdrop-blur-md text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700/60 flex items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-2.5 min-w-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <p className="truncate font-medium text-xs sm:text-sm">{toast.message}</p>
            </div>

            {toast.action && (
              <button
                type="button"
                onClick={() => {
                  toast.action?.onClick();
                  onClose();
                }}
                className="shrink-0 px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-400/30 cursor-pointer transition-colors"
              >
                {toast.action.label}
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
