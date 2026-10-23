import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Avatar } from '../components/Avatar';
import { MatchRing } from '../components/MatchRing';
import { Button } from '../components/Button';
import { Chip } from '../components/Chip';
import { BottomSheet } from '../components/BottomSheet';
import { calculateMatch } from '../lib/matching';
import { ALL_INTERESTS } from '../data/interests';
import {
  ArrowLeft,
  MoreVertical,
  MapPin,
  Briefcase,
  GraduationCap,
  Target,
  Share2,
  Flag,
  ShieldAlert,
  MessageCircle,
  Check,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const {
    selectedUserId,
    allUsers,
    currentUser,
    connections,
    sentRequests,
    sendConnectionRequest,
    blockUser,
    goBack,
    navigateTo,
    showToast,
  } = useApp();

  const [menuOpen, setMenuOpen] = useState(false);
  const [blockConfirmOpen, setBlockConfirmOpen] = useState(false);

  const candidate = allUsers.find((u) => u.id === selectedUserId) || allUsers[0];

  const isConnected = connections.includes(candidate.id);
  const isSent = sentRequests.some((r) => r.toUserId === candidate.id);

  const match = calculateMatch(currentUser, candidate);

  // Group interests into Shared vs Other
  const sharedIds = candidate.interests.filter((id) => currentUser.interests?.includes(id));
  const otherIds = candidate.interests.filter((id) => !currentUser.interests?.includes(id));

  const handleShare = () => {
    setMenuOpen(false);
    showToast('Profile link copied to clipboard');
  };

  const handleReport = () => {
    setMenuOpen(false);
    showToast('Thank you for reporting. Our safety team will review this profile.');
  };

  const handleBlockConfirm = () => {
    setBlockConfirmOpen(false);
    setMenuOpen(false);
    blockUser(candidate.id);
    goBack();
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-white dark:bg-[#0B1020] text-slate-900 dark:text-white select-none overflow-hidden">
      {/* Floating Top Nav */}
      <header className="absolute top-0 left-0 right-0 z-30 p-4 flex items-center justify-between">
        <button
          type="button"
          onClick={goBack}
          aria-label="Back"
          className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Options"
          className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </header>

      {/* Scrollable Profile Body */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {/* CSS Gradient Cover Banner */}
        <div
          style={{ background: candidate.coverGradient }}
          className="relative w-full h-44 transition-all"
        />

        {/* Profile Card Header Container */}
        <div className="px-5 relative -mt-14 space-y-4">
          <div className="flex items-end justify-between">
            <div className="ring-4 ring-white dark:ring-[#0B1020] rounded-full overflow-hidden shadow-lg bg-white dark:bg-slate-900">
              <Avatar
                src={candidate.avatar}
                name={candidate.name}
                size="2xl"
                isOnline={candidate.isOnline}
                showOnline
              />
            </div>

            <div className="bg-white dark:bg-[#121833] p-2.5 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col items-center">
              <MatchRing score={match.score} size={48} strokeWidth={4} />
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-1">
                Synergy
              </span>
            </div>
          </div>

          {/* Name & Titles */}
          <div className="space-y-1">
            <h2 className="font-display font-extrabold text-2xl text-slate-900 dark:text-white tracking-tight">
              {candidate.name}
            </h2>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                {candidate.jobTitle} at {candidate.company}
              </span>
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>
                {candidate.location} · {candidate.industry}
              </span>
            </p>
          </div>

          {/* Match Reason Banner */}
          <div className="p-3.5 bg-indigo-50/80 dark:bg-indigo-950/40 rounded-2xl border border-indigo-100 dark:border-indigo-900/50">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Why you match
            </span>
            <p className="text-xs text-indigo-950 dark:text-indigo-200 mt-0.5 leading-relaxed font-normal">
              {match.reason}
            </p>
          </div>

          {/* About Intro */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
              About
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {candidate.intro}
            </p>
          </div>

          {/* Shared Interests */}
          {sharedIds.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                  Shared Interests
                </h3>
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  {sharedIds.length} in common
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {sharedIds.map((id) => {
                  const label = ALL_INTERESTS.find((i) => i.id === id)?.label || id;
                  return <Chip key={id} label={label} size="sm" highlighted />;
                })}
              </div>
            </div>
          )}

          {/* Other Interests */}
          {otherIds.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                Other Interests
              </h3>
              <div className="flex flex-wrap gap-2">
                {otherIds.map((id) => {
                  const label = ALL_INTERESTS.find((i) => i.id === id)?.label || id;
                  return <Chip key={id} label={label} size="sm" />;
                })}
              </div>
            </div>
          )}

          {/* Core Skills */}
          {candidate.skills.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                Skills & Specialties
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {candidate.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 dark:bg-[#1A2142] text-slate-700 dark:text-slate-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Experience Timeline */}
          {candidate.experience.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                Experience
              </h3>
              <div className="space-y-3">
                {candidate.experience.map((exp) => (
                  <div
                    key={exp.id}
                    className="relative pl-4 border-l-2 border-indigo-400/50 space-y-1 text-xs"
                  >
                    <h5 className="font-semibold text-slate-900 dark:text-white text-sm">
                      {exp.role}
                    </h5>
                    <p className="text-slate-600 dark:text-slate-300 font-medium">
                      {exp.company} · {exp.startDate} – {exp.endDate}
                    </p>
                    {exp.description && (
                      <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {candidate.education.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-slate-400" />
                <span>Education</span>
              </h3>
              <div className="space-y-2">
                {candidate.education.map((edu) => (
                  <div key={edu.id} className="text-xs space-y-0.5">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {edu.degree} in {edu.field}
                    </p>
                    <p className="text-slate-500 dark:text-slate-400">
                      {edu.school} · {edu.startYear} – {edu.endYear}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Career Goals */}
          {candidate.goals.length > 0 && (
            <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-4 h-4 text-slate-400" />
                <span>Career Goals</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {candidate.goals.map((g) => (
                  <span
                    key={g}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-[#0B1020]/90 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 pb-safe z-30">
        {isConnected ? (
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => navigateTo('chat', { userId: candidate.id })}
            leftIcon={<MessageCircle className="w-5 h-5" />}
          >
            Message {candidate.name.split(' ')[0]}
          </Button>
        ) : isSent ? (
          <Button
            variant="secondary"
            size="lg"
            fullWidth
            disabled
            leftIcon={<Check className="w-5 h-5 text-emerald-500" />}
          >
            Connection Requested
          </Button>
        ) : (
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => sendConnectionRequest(candidate.id)}
          >
            Connect with {candidate.name.split(' ')[0]}
          </Button>
        )}
      </div>

      {/* Overflow Menu Bottom Sheet */}
      <BottomSheet isOpen={menuOpen} onClose={() => setMenuOpen(false)} title="Profile Options">
        <div className="space-y-2">
          <button
            type="button"
            onClick={handleShare}
            className="w-full p-3.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-3 text-sm font-medium text-slate-800 dark:text-slate-200 cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-indigo-500" />
            <span>Share profile link</span>
          </button>
          <button
            type="button"
            onClick={handleReport}
            className="w-full p-3.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-3 text-sm font-medium text-slate-800 dark:text-slate-200 cursor-pointer"
          >
            <Flag className="w-4 h-4 text-amber-500" />
            <span>Report profile</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              setBlockConfirmOpen(true);
            }}
            className="w-full p-3.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-3 text-sm font-medium text-rose-600 dark:text-rose-400 cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            <span>Block this user</span>
          </button>
        </div>
      </BottomSheet>

      {/* Block Confirmation Bottom Sheet */}
      <BottomSheet
        isOpen={blockConfirmOpen}
        onClose={() => setBlockConfirmOpen(false)}
        title="Block User?"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Are you sure you want to block {candidate.name}? They will no longer be able to message
            you or view your profile.
          </p>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setBlockConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              fullWidth
              onClick={handleBlockConfirm}
            >
              Confirm Block
            </Button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
};
