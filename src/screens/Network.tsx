import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Avatar } from '../components/Avatar';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { TabBar } from '../components/TabBar';
import { EmptyState } from '../components/EmptyState';
import {
  Users,
  Search,
  MessageCircle,
  UserCheck,
  Clock,
  ArrowUpRight,
  Check,
  X,
  MapPin,
  Briefcase,
} from 'lucide-react';

export const Network: React.FC = () => {
  const {
    allUsers,
    connections,
    incomingRequests,
    sentRequests,
    acceptRequest,
    declineRequest,
    withdrawRequest,
    navigateTo,
    switchTab,
    unreadMessagesCount,
  } = useApp();

  const [activeSegment, setActiveSegment] = useState<'connections' | 'requests' | 'sent'>('connections');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Connection users
  const connectedUsers = useMemo(() => {
    return allUsers.filter((u) => connections.includes(u.id));
  }, [allUsers, connections]);

  // Filtered connections by search
  const filteredConnections = useMemo(() => {
    if (!searchQuery.trim()) return connectedUsers;
    const q = searchQuery.toLowerCase();
    return connectedUsers.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.jobTitle.toLowerCase().includes(q) ||
        u.company.toLowerCase().includes(q) ||
        u.location.toLowerCase().includes(q)
    );
  }, [connectedUsers, searchQuery]);

  return (
    <div className="relative w-full h-full flex flex-col bg-[#F7F8FC] dark:bg-[#0B1020] text-slate-900 dark:text-white overflow-hidden">
      {/* Top Header */}
      <header className="px-5 pt-3 pb-3 bg-white/70 dark:bg-[#0B1020]/70 backdrop-blur-md sticky top-0 z-20 border-b border-slate-200/50 dark:border-slate-800/50 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-2xl tracking-tight">
            My Network
          </h2>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 tabular-nums">
            {connectedUsers.length} connections
          </span>
        </div>

        {/* Segmented Control */}
        <div className="p-1 bg-slate-100 dark:bg-[#1A2142] rounded-xl grid grid-cols-3 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveSegment('connections')}
            className={`py-2 rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
              activeSegment === 'connections'
                ? 'bg-white dark:bg-[#121833] text-slate-900 dark:text-white shadow-xs font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            <span>Connections</span>
            <span className="text-[11px] opacity-70">({connectedUsers.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSegment('requests')}
            className={`py-2 rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
              activeSegment === 'requests'
                ? 'bg-white dark:bg-[#121833] text-slate-900 dark:text-white shadow-xs font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            <span>Requests</span>
            {incomingRequests.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                {incomingRequests.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveSegment('sent')}
            className={`py-2 rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
              activeSegment === 'sent'
                ? 'bg-white dark:bg-[#121833] text-slate-900 dark:text-white shadow-xs font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            <span>Sent</span>
            <span className="text-[11px] opacity-70">({sentRequests.length})</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-20 p-5 space-y-4">
        {activeSegment === 'connections' && (
          <div className="space-y-3.5">
            <Input
              placeholder="Filter connections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />

            {filteredConnections.length === 0 ? (
              <EmptyState
                icon={Users}
                title="No connections yet"
                description="Explore top matches on Discover and connect with professionals sharing your interests."
                actionLabel="Explore Discover"
                onAction={() => switchTab('discover')}
              />
            ) : (
              <div className="space-y-2.5">
                {filteredConnections.map((user) => (
                  <motion.div
                    key={user.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 bg-white dark:bg-[#121833] rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex items-center justify-between gap-3 hover:border-slate-300 transition-colors"
                  >
                    <div
                      onClick={() => navigateTo('profile-view', { userId: user.id })}
                      className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                    >
                      <Avatar
                        src={user.avatar}
                        name={user.name}
                        size="md"
                        isOnline={user.isOnline}
                        showOnline
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-display font-semibold text-sm text-slate-900 dark:text-white truncate">
                          {user.name}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {user.jobTitle} at {user.company}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigateTo('chat', { userId: user.id })}
                      aria-label={`Message ${user.name}`}
                      className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-colors cursor-pointer shrink-0"
                    >
                      <MessageCircle className="w-4 h-4 stroke-[2.2]" />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeSegment === 'requests' && (
          <div className="space-y-3.5">
            {incomingRequests.length === 0 ? (
              <EmptyState
                icon={UserCheck}
                title="All caught up"
                description="You don’t have any pending incoming connection requests right now."
              />
            ) : (
              <AnimatePresence>
                {incomingRequests.map((req) => {
                  const sender = allUsers.find((u) => u.id === req.fromUserId);
                  if (!sender) return null;

                  return (
                    <motion.div
                      key={req.id}
                      layout
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0, overflow: 'hidden' }}
                      transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                      className="p-4 bg-white dark:bg-[#121833] rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-3"
                    >
                      <div
                        onClick={() => navigateTo('profile-view', { userId: sender.id })}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <Avatar src={sender.avatar} name={sender.name} size="lg" />
                        <div className="min-w-0 flex-1">
                          <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white truncate">
                            {sender.name}
                          </h4>
                          <p className="text-xs text-slate-600 dark:text-slate-300 truncate">
                            {sender.jobTitle} at {sender.company}
                          </p>
                          <span className="text-[10px] text-slate-400">{req.createdAt}</span>
                        </div>
                      </div>

                      {req.note && (
                        <div className="p-3 bg-slate-50 dark:bg-[#1A2142] rounded-xl text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic border border-slate-100 dark:border-slate-800">
                          "{req.note}"
                        </div>
                      )}

                      <div className="flex items-center gap-2 pt-1">
                        <Button
                          variant="secondary"
                          size="sm"
                          fullWidth
                          onClick={() => declineRequest(req.id)}
                        >
                          Decline
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          fullWidth
                          onClick={() => acceptRequest(req.id)}
                          leftIcon={<Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                        >
                          Accept
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>
        )}

        {activeSegment === 'sent' && (
          <div className="space-y-3.5">
            {sentRequests.length === 0 ? (
              <EmptyState
                icon={Clock}
                title="No sent requests"
                description="When you send connection requests, you can track or withdraw them here."
              />
            ) : (
              <AnimatePresence>
                {sentRequests.map((req) => {
                  const recipient = allUsers.find((u) => u.id === req.toUserId);
                  if (!recipient) return null;

                  return (
                    <motion.div
                      key={req.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0, overflow: 'hidden' }}
                      className="p-3.5 bg-white dark:bg-[#121833] rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex items-center justify-between gap-3"
                    >
                      <div
                        onClick={() => navigateTo('profile-view', { userId: recipient.id })}
                        className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                      >
                        <Avatar src={recipient.avatar} name={recipient.name} size="md" />
                        <div className="min-w-0 flex-1">
                          <h4 className="font-display font-semibold text-sm text-slate-900 dark:text-white truncate">
                            {recipient.name}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            Sent {req.createdAt}
                          </p>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => withdrawRequest(req.id)}
                      >
                        Withdraw
                      </Button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>
        )}
      </div>

      {/* Sticky Bottom Tab Bar */}
      <TabBar
        activeTab="network"
        onSelectTab={switchTab}
        requestsCount={incomingRequests.length}
        unreadMessagesCount={unreadMessagesCount}
      />
    </div>
  );
};
