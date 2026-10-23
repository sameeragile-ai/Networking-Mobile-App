import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Users, MessageCircle, User as UserIcon } from 'lucide-react';
import { MainTab } from '../types';

interface TabBarProps {
  activeTab: MainTab;
  onSelectTab: (tab: MainTab) => void;
  requestsCount?: number;
  unreadMessagesCount?: number;
}

interface TabConfig {
  id: MainTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export const TabBar: React.FC<TabBarProps> = ({
  activeTab,
  onSelectTab,
  requestsCount = 0,
  unreadMessagesCount = 0,
}) => {
  const tabs: TabConfig[] = [
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'network', label: 'Network', icon: Users, badge: requestsCount },
    { id: 'messages', label: 'Messages', icon: MessageCircle, badge: unreadMessagesCount },
    { id: 'my-profile', label: 'Profile', icon: UserIcon },
  ];

  return (
    <nav
      aria-label="Main Navigation"
      className="absolute bottom-0 left-0 right-0 z-40 bg-white/85 dark:bg-[#121833]/85 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800/80 pb-safe shadow-[0_-4px_24px_rgba(0,0,0,0.03)]"
    >
      <div className="grid grid-cols-4 h-16 items-center px-2 max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className="relative flex flex-col items-center justify-center h-full w-full py-1 group cursor-pointer focus:outline-hidden"
            >
              {/* LayoutId animated active indicator line/glow */}
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute top-0 w-8 h-0.5 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}

              <div className="relative">
                <motion.div
                  whileTap={{ scale: 0.85 }}
                  transition={{ type: 'spring', stiffness: 600, damping: 25 }}
                  className={`p-1 transition-colors duration-200 ${
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-5 h-5 stroke-[2.2]" />
                </motion.div>

                {/* Badge */}
                {tab.badge && tab.badge > 0 ? (
                  <span className="absolute -top-1 -right-2 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs ring-2 ring-white dark:ring-[#121833] tabular-nums">
                    {tab.badge > 99 ? '99+' : tab.badge}
                  </span>
                ) : null}
              </div>

              <span
                className={`text-[11px] font-medium tracking-tight mt-0.5 transition-colors duration-200 ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
