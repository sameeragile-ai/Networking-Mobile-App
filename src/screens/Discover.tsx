import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { ProfileCard } from '../components/ProfileCard';
import { BottomSheet } from '../components/BottomSheet';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { TabBar } from '../components/TabBar';
import { DiscoverCardSkeleton } from '../components/Skeleton';
import { EmptyState } from '../components/EmptyState';
import { getRecommendedCandidates } from '../lib/matching';
import { ALL_INTERESTS, INDUSTRIES, CAREER_GOALS } from '../data/interests';
import {
  Bell,
  Search,
  SlidersHorizontal,
  RotateCw,
  Sparkles,
  Users,
  Compass,
  CheckCircle2,
  X,
} from 'lucide-react';

export const Discover: React.FC = () => {
  const {
    currentUser,
    allUsers,
    connections,
    sentRequests,
    dismissedUserIds,
    blockedUserIds,
    sendConnectionRequest,
    dismissUser,
    navigateTo,
    switchTab,
    incomingRequests,
    unreadMessagesCount,
    unreadNotificationsCount,
    notifications,
    markNotificationsRead,
    filters,
    setFilters,
    resetFilters,
  } = useApp();

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [notifSheetOpen, setNotifSheetOpen] = useState(false);

  // Local copy of filters inside sheet
  const [tempFilters, setTempFilters] = useState(filters);

  // Initial skeleton load for 600ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 700);
  };

  const handleApplyFilters = () => {
    setFilters(tempFilters);
    setFilterSheetOpen(false);
  };

  const handleResetFilters = () => {
    resetFilters();
    setTempFilters({
      industry: '',
      experienceLevel: '',
      goal: '',
      location: '',
      minMatchScore: 0,
    });
    setFilterSheetOpen(false);
  };

  // Sent user IDs
  const sentUserIds = useMemo(
    () => sentRequests.map((r) => r.toUserId),
    [sentRequests]
  );

  // Recommendation engine calculations
  const matches = useMemo(() => {
    return getRecommendedCandidates(currentUser, allUsers, {
      connectedIds: connections,
      sentRequestIds: sentUserIds,
      dismissedIds: dismissedUserIds,
      blockedIds: blockedUserIds,
      industryFilter: filters.industry || undefined,
      experienceFilter: filters.experienceLevel || undefined,
      goalFilter: filters.goal || undefined,
      locationFilter: filters.location || undefined,
      minScore: filters.minMatchScore || 0,
      searchQuery,
    });
  }, [
    currentUser,
    allUsers,
    connections,
    sentUserIds,
    dismissedUserIds,
    blockedUserIds,
    filters,
    searchQuery,
  ]);

  // Split into Top Matches carousel and Interest-based sections
  const topMatches = useMemo(() => matches.slice(0, 6), [matches]);

  // Top 2 user interests for dedicated sections
  const userTopInterestIds = useMemo(
    () => currentUser.interests?.slice(0, 2) || [],
    [currentUser.interests]
  );

  const interestSections = useMemo(() => {
    return userTopInterestIds.map((interestId) => {
      const interestObj = ALL_INTERESTS.find((i) => i.id === interestId);
      const label = interestObj?.label || interestId;
      const relevantMatches = matches.filter((m) =>
        m.candidate.interests.includes(interestId)
      );
      return {
        interestId,
        label,
        matches: relevantMatches.slice(0, 4),
      };
    });
  }, [userTopInterestIds, matches]);

  const firstName = currentUser.name.split(' ')[0] || 'there';

  return (
    <div className="relative w-full h-full flex flex-col bg-[#F7F8FC] dark:bg-[#0B1020] text-slate-900 dark:text-white overflow-hidden">
      {/* Top Header */}
      <header className="px-5 pt-3 pb-3 flex items-center justify-between bg-white/70 dark:bg-[#0B1020]/70 backdrop-blur-md sticky top-0 z-20 border-b border-slate-200/50 dark:border-slate-800/50">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Good morning
          </span>
          <h2 className="font-display font-bold text-xl tracking-tight leading-tight">
            Hello, {firstName}
          </h2>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Pull to refresh trigger button */}
          <button
            type="button"
            onClick={handleRefresh}
            aria-label="Refresh feed"
            className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>

          {/* Notifications Bell */}
          <button
            type="button"
            onClick={() => {
              setNotifSheetOpen(true);
              markNotificationsRead();
            }}
            aria-label="Notifications"
            className="relative p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <Bell className="w-5 h-5 stroke-[2]" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-[#0B1020]" />
            )}
          </button>
        </div>
      </header>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-20 space-y-6">
        {/* Search & Filter Bar */}
        <div className="px-5 pt-3 flex items-center gap-2.5">
          <div className="flex-1">
            <Input
              placeholder="Search by skill, company, title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <button
            type="button"
            onClick={() => setFilterSheetOpen(true)}
            aria-label="Filter recommendations"
            className={`h-11 w-11 rounded-xl border flex items-center justify-center cursor-pointer transition-colors ${
              filters.industry || filters.goal || filters.experienceLevel || filters.minMatchScore > 0
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white dark:bg-[#121833] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/80 hover:border-slate-300'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body: Skeleton or Feed */}
        {isLoading || isRefreshing ? (
          <div className="px-5 space-y-4">
            <DiscoverCardSkeleton />
            <DiscoverCardSkeleton />
          </div>
        ) : matches.length === 0 ? (
          <EmptyState
            icon={Compass}
            title="No matches found"
            description="Try relaxing your filters or updating your interest tags to discover more peers."
            actionLabel="Reset filters"
            onAction={handleResetFilters}
            className="mt-8"
          />
        ) : (
          <>
            {/* Section 1: TOP MATCHES CAROUSEL */}
            <section className="space-y-3">
              <div className="px-5 flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white tracking-tight">
                    Top matches for you
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Highest synergy based on your profile
                  </p>
                </div>
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 tabular-nums">
                  {matches.length} candidates
                </span>
              </div>

              {/* Horizontal scroll carousel */}
              <div className="flex gap-4 overflow-x-auto no-scrollbar px-5 pb-2 pt-1 snap-x snap-mandatory">
                <AnimatePresence>
                  {topMatches.map((match) => (
                    <div key={match.candidate.id} className="snap-start shrink-0">
                      <ProfileCard
                        match={match}
                        layout="carousel"
                        onConnect={(id) => sendConnectionRequest(id)}
                        onDismiss={(id) => dismissUser(id)}
                        onViewProfile={(id) => navigateTo('profile-view', { userId: id })}
                      />
                    </div>
                  ))}
                </AnimatePresence>
              </div>
            </section>

            {/* Section 2: BECAUSE YOU'RE INTO [INTEREST] */}
            {interestSections.map((sec) => {
              if (sec.matches.length === 0) return null;
              return (
                <section key={sec.interestId} className="px-5 space-y-3">
                  <div className="border-t border-slate-200/60 dark:border-slate-800/80 pt-4">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                      Interest Synergy
                    </span>
                    <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white tracking-tight">
                      Because you’re into {sec.label}
                    </h3>
                  </div>

                  <div className="space-y-3.5">
                    <AnimatePresence>
                      {sec.matches.map((match) => (
                        <ProfileCard
                          key={`${sec.interestId}-${match.candidate.id}`}
                          match={match}
                          layout="standard"
                          onConnect={(id) => sendConnectionRequest(id)}
                          onDismiss={(id) => dismissUser(id)}
                          onViewProfile={(id) => navigateTo('profile-view', { userId: id })}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </section>
              );
            })}
          </>
        )}
      </div>

      {/* Filter Bottom Sheet */}
      <BottomSheet
        isOpen={filterSheetOpen}
        onClose={() => setFilterSheetOpen(false)}
        title="Filter Discover Feed"
      >
        <div className="space-y-4">
          {/* Industry Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Industry
            </label>
            <select
              value={tempFilters.industry}
              onChange={(e) => setTempFilters({ ...tempFilters, industry: e.target.value })}
              className="w-full h-11 bg-slate-50 dark:bg-[#1A2142] rounded-xl border border-slate-200 dark:border-slate-700 px-3 text-sm outline-none"
            >
              <option value="">All Industries</option>
              {INDUSTRIES.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>

          {/* Goal Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Career Goal
            </label>
            <select
              value={tempFilters.goal}
              onChange={(e) => setTempFilters({ ...tempFilters, goal: e.target.value })}
              className="w-full h-11 bg-slate-50 dark:bg-[#1A2142] rounded-xl border border-slate-200 dark:border-slate-700 px-3 text-sm outline-none"
            >
              <option value="">Any Goal</option>
              {CAREER_GOALS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Minimum Match % Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Minimum Match Score
              </span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                {tempFilters.minMatchScore}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              step="5"
              value={tempFilters.minMatchScore}
              onChange={(e) =>
                setTempFilters({ ...tempFilters, minMatchScore: Number(e.target.value) })
              }
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Filter Actions */}
          <div className="pt-3 flex gap-2.5">
            <Button variant="secondary" size="md" fullWidth onClick={handleResetFilters}>
              Reset
            </Button>
            <Button variant="primary" size="md" fullWidth onClick={handleApplyFilters}>
              Apply Filters
            </Button>
          </div>
        </div>
      </BottomSheet>

      {/* Notifications Bottom Sheet */}
      <BottomSheet
        isOpen={notifSheetOpen}
        onClose={() => setNotifSheetOpen(false)}
        title="Notifications"
      >
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-6">No notifications yet</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-[#1A2142] border border-slate-200/60 dark:border-slate-800 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <h5 className="font-semibold text-xs text-slate-900 dark:text-white">
                    {n.title}
                  </h5>
                  <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">{n.body}</p>
              </div>
            ))
          )}
        </div>
      </BottomSheet>

      {/* Sticky Bottom Tab Bar */}
      <TabBar
        activeTab="discover"
        onSelectTab={switchTab}
        requestsCount={incomingRequests.length}
        unreadMessagesCount={unreadMessagesCount}
      />
    </div>
  );
};
