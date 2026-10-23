import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Avatar } from '../components/Avatar';
import { MatchRing } from '../components/MatchRing';
import { Button } from '../components/Button';
import { Chip } from '../components/Chip';
import { TabBar } from '../components/TabBar';
import { ALL_INTERESTS } from '../data/interests';
import {
  Settings,
  Pencil,
  MapPin,
  Briefcase,
  GraduationCap,
  Target,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';

export const MyProfile: React.FC = () => {
  const {
    currentUser,
    navigateTo,
    switchTab,
    calculateCompleteness,
    incomingRequests,
    unreadMessagesCount,
  } = useApp();

  const { percentage, tips } = calculateCompleteness(currentUser);

  return (
    <div className="relative w-full h-full flex flex-col bg-white dark:bg-[#0B1020] text-slate-900 dark:text-white select-none overflow-hidden">
      {/* Top Header */}
      <header className="px-5 pt-3 pb-3 bg-white/70 dark:bg-[#0B1020]/70 backdrop-blur-md sticky top-0 z-20 border-b border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between">
        <h2 className="font-display font-bold text-2xl tracking-tight">
          My Profile
        </h2>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigateTo('settings')}
            aria-label="Settings"
            className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <Settings className="w-5 h-5 stroke-[2]" />
          </button>
        </div>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {/* Profile Completeness Banner */}
        <div className="m-5 p-4 rounded-3xl bg-slate-50 dark:bg-[#121833] border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex items-center gap-4">
          <MatchRing score={percentage} size={50} strokeWidth={4} />
          <div className="min-w-0 flex-1 space-y-0.5">
            <div className="flex items-center justify-between">
              <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white">
                Profile Completeness
              </h4>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                {percentage}%
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {tips.length > 0 ? tips[0] : 'Your profile is fully optimized!'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigateTo('edit-profile')}
            className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-xl cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Cover Gradient */}
        <div
          style={{ background: currentUser.coverGradient }}
          className="relative w-full h-36"
        />

        {/* Profile Card Header */}
        <div className="px-5 relative -mt-12 space-y-4">
          <div className="flex items-end justify-between">
            <div className="ring-4 ring-white dark:ring-[#0B1020] rounded-full overflow-hidden shadow-lg bg-white dark:bg-slate-900">
              <Avatar src={currentUser.avatar} name={currentUser.name} size="2xl" />
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigateTo('edit-profile')}
              leftIcon={<Pencil className="w-3.5 h-3.5" />}
            >
              Edit Profile
            </Button>
          </div>

          {/* Name & Titles */}
          <div className="space-y-1">
            <h3 className="font-display font-extrabold text-2xl text-slate-900 dark:text-white tracking-tight">
              {currentUser.name}
            </h3>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                {currentUser.jobTitle} at {currentUser.company}
              </span>
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>
                {currentUser.location} · {currentUser.industry}
              </span>
            </p>
          </div>

          {/* About */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
              About
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {currentUser.intro}
            </p>
          </div>

          {/* Selected Interests */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                My Interests
              </h4>
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                {currentUser.interests?.length || 0} active
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {currentUser.interests?.map((id) => {
                const label = ALL_INTERESTS.find((i) => i.id === id)?.label || id;
                return <Chip key={id} label={label} size="sm" highlighted />;
              })}
            </div>
          </div>

          {/* Skills */}
          {currentUser.skills && currentUser.skills.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                Core Skills
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {currentUser.skills.map((skill) => (
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

          {/* Experience */}
          {currentUser.experience && currentUser.experience.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                Experience
              </h4>
              <div className="space-y-3">
                {currentUser.experience.map((exp) => (
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
          {currentUser.education && currentUser.education.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-slate-400" />
                <span>Education</span>
              </h4>
              <div className="space-y-2">
                {currentUser.education.map((edu) => (
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
          {currentUser.goals && currentUser.goals.length > 0 && (
            <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-4 h-4 text-slate-400" />
                <span>Career Goals</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {currentUser.goals.map((g) => (
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

      {/* Sticky Bottom Tab Bar */}
      <TabBar
        activeTab="my-profile"
        onSelectTab={switchTab}
        requestsCount={incomingRequests.length}
        unreadMessagesCount={unreadMessagesCount}
      />
    </div>
  );
};
