import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, MatchResult } from '../types';
import { Avatar } from './Avatar';
import { MatchRing } from './MatchRing';
import { Button } from './Button';
import { Chip } from './Chip';
import { MapPin, Briefcase, Check, X } from 'lucide-react';

interface ProfileCardProps {
  match: MatchResult;
  isSent?: boolean;
  onConnect: (candidateId: string) => void;
  onDismiss: (candidateId: string) => void;
  onViewProfile: (candidateId: string) => void;
  layout?: 'carousel' | 'standard';
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  match,
  isSent = false,
  onConnect,
  onDismiss,
  onViewProfile,
  layout = 'standard',
}) => {
  const { candidate, score, sharedInterests, reason } = match;
  const [justConnected, setJustConnected] = useState(false);

  const handleConnectClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isSent && !justConnected) {
      setJustConnected(true);
      onConnect(candidate.id);
    }
  };

  const handleDismissClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDismiss(candidate.id);
  };

  const isPending = isSent || justConnected;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      onClick={() => onViewProfile(candidate.id)}
      className={`relative bg-white dark:bg-[#121833] rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between ${
        layout === 'carousel' ? 'w-[300px] shrink-0' : 'w-full'
      }`}
    >
      {/* Dismiss button */}
      <button
        type="button"
        onClick={handleDismissClick}
        aria-label={`Dismiss ${candidate.name}`}
        className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors z-10 cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Top Header */}
      <div>
        <div className="flex items-start gap-3.5 pr-7">
          <Avatar
            src={candidate.avatar}
            name={candidate.name}
            size="lg"
            isOnline={candidate.isOnline}
            showOnline
          />

          <div className="min-w-0 flex-1">
            <h4 className="font-display font-bold text-base text-slate-900 dark:text-white truncate">
              {candidate.name}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium truncate flex items-center gap-1 mt-0.5">
              <Briefcase className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate">{candidate.jobTitle}</span>
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate">{candidate.location}</span>
            </p>
          </div>

          <MatchRing score={score} size={42} strokeWidth={3.5} />
        </div>

        {/* Why you match */}
        <div className="mt-3.5 px-3 py-2 bg-indigo-50/70 dark:bg-indigo-950/30 rounded-xl border border-indigo-100/60 dark:border-indigo-900/40">
          <p className="text-xs text-indigo-900 dark:text-indigo-200 leading-relaxed font-normal">
            {reason}
          </p>
        </div>

        {/* Shared interests chips (up to 3) */}
        {sharedInterests.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {sharedInterests.slice(0, 3).map((item) => (
              <Chip key={item} label={item} size="sm" highlighted />
            ))}
            {sharedInterests.length > 3 && (
              <span className="text-[11px] font-medium text-slate-400 self-center pl-1">
                +{sharedInterests.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Bottom Action */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
        <Button
          variant={isPending ? 'secondary' : 'primary'}
          size="sm"
          fullWidth
          onClick={handleConnectClick}
          disabled={isPending}
          leftIcon={isPending ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : undefined}
        >
          {isPending ? 'Requested' : 'Connect'}
        </Button>
      </div>
    </motion.div>
  );
};
