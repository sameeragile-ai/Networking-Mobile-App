import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Avatar } from '../components/Avatar';
import { Input } from '../components/Input';
import { TabBar } from '../components/TabBar';
import { EmptyState } from '../components/EmptyState';
import { MessageCircle, Search, Trash2, BellOff } from 'lucide-react';

export const Messages: React.FC = () => {
  const {
    conversations,
    allUsers,
    navigateTo,
    switchTab,
    deleteConversation,
    incomingRequests,
    unreadMessagesCount,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');

  // Enrich conversations with user details
  const enrichedConversations = useMemo(() => {
    return conversations
      .map((conv) => {
        const participant = allUsers.find((u) => u.id === conv.participantId);
        return {
          ...conv,
          participant,
        };
      })
      .filter((c) => !!c.participant);
  }, [conversations, allUsers]);

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return enrichedConversations;
    const q = searchQuery.toLowerCase();
    return enrichedConversations.filter(
      (c) =>
        c.participant?.name.toLowerCase().includes(q) ||
        c.lastMessage.toLowerCase().includes(q)
    );
  }, [enrichedConversations, searchQuery]);

  return (
    <div className="relative w-full h-full flex flex-col bg-[#F7F8FC] dark:bg-[#0B1020] text-slate-900 dark:text-white overflow-hidden">
      {/* Top Header */}
      <header className="px-5 pt-3 pb-3 bg-white/70 dark:bg-[#0B1020]/70 backdrop-blur-md sticky top-0 z-20 border-b border-slate-200/50 dark:border-slate-800/50 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-2xl tracking-tight">
            Messages
          </h2>
          {unreadMessagesCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold text-xs border border-indigo-200 dark:border-indigo-800/40">
              {unreadMessagesCount} unread
            </span>
          )}
        </div>

        <Input
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />
      </header>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-20 p-5 space-y-2">
        {filteredConversations.length === 0 ? (
          <EmptyState
            icon={MessageCircle}
            title="No conversations yet"
            description="When you connect with peers on Meridian, you can start meaningful direct conversations."
            actionLabel="Find people to talk to"
            onAction={() => switchTab('discover')}
            className="mt-8"
          />
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {filteredConversations.map((conv) => {
                const p = conv.participant!;
                const hasUnread = conv.unreadCount > 0;

                return (
                  <motion.div
                    key={conv.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                    onClick={() => navigateTo('chat', { userId: p.id })}
                    className={`relative p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      hasUnread
                        ? 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900/40 shadow-xs'
                        : 'bg-white dark:bg-[#121833] border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <Avatar
                        src={p.avatar}
                        name={p.name}
                        size="lg"
                        isOnline={p.isOnline}
                        showOnline
                      />
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <div className="flex items-center justify-between">
                          <h4
                            className={`font-display text-sm truncate ${
                              hasUnread
                                ? 'font-bold text-slate-900 dark:text-white'
                                : 'font-semibold text-slate-800 dark:text-slate-200'
                            }`}
                          >
                            {p.name}
                          </h4>
                          <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                            {conv.lastMessageTimestamp}
                          </span>
                        </div>

                        <p
                          className={`text-xs truncate ${
                            hasUnread
                              ? 'font-medium text-slate-900 dark:text-slate-100'
                              : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {conv.lastMessage}
                        </p>
                      </div>
                    </div>

                    {/* Unread badge & Quick actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {hasUnread && (
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 ring-2 ring-indigo-200 dark:ring-indigo-900" />
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteConversation(p.id);
                        }}
                        title="Delete conversation"
                        className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Sticky Bottom Tab Bar */}
      <TabBar
        activeTab="messages"
        onSelectTab={switchTab}
        requestsCount={incomingRequests.length}
        unreadMessagesCount={unreadMessagesCount}
      />
    </div>
  );
};
