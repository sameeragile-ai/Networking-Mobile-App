import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Button } from '../components/Button';
import { BottomSheet } from '../components/BottomSheet';
import { Avatar } from '../components/Avatar';
import {
  ArrowLeft,
  Moon,
  Sun,
  Bell,
  Eye,
  Shield,
  FileText,
  HelpCircle,
  LogOut,
  Trash2,
  ChevronRight,
  Check,
} from 'lucide-react';

export const Settings: React.FC = () => {
  const {
    theme,
    toggleTheme,
    blockedUserIds,
    unblockUser,
    allUsers,
    logOut,
    deleteAccount,
    goBack,
    showToast,
  } = useApp();

  const [pushNotifs, setPushNotifs] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(false);
  const [visibility, setVisibility] = useState<'everyone' | 'connections'>('everyone');

  // Bottom sheets
  const [blockedSheetOpen, setBlockedSheetOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const blockedUsers = allUsers.filter((u) => blockedUserIds.includes(u.id));

  return (
    <div className="relative w-full h-full flex flex-col bg-white dark:bg-[#0B1020] text-slate-900 dark:text-white select-none overflow-hidden">
      {/* Top Header */}
      <header className="px-4 py-3 bg-white/80 dark:bg-[#0B1020]/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between sticky top-0 z-20">
        <button
          type="button"
          onClick={goBack}
          aria-label="Back"
          className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h3 className="font-display font-bold text-base">Settings</h3>
        <div className="w-8" />
      </header>

      {/* Settings list */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-6 pb-20">
        {/* Appearance */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Appearance
          </span>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#121833] border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white dark:bg-[#1A2142] text-indigo-600 dark:text-indigo-400">
                {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </div>
              <div>
                <p className="text-sm font-semibold">Dark Mode</p>
                <p className="text-xs text-slate-500">Toggle dark aesthetic</p>
              </div>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                theme === 'dark' ? 'bg-indigo-600 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Notifications
          </span>
          <div className="rounded-2xl bg-slate-50 dark:bg-[#121833] border border-slate-200/60 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium">In-app & push alerts</span>
              </div>
              <button
                type="button"
                onClick={() => setPushNotifs(!pushNotifs)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  pushNotifs ? 'bg-indigo-600 justify-end' : 'bg-slate-300 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
              </button>
            </div>

            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium">Weekly digest email</span>
              </div>
              <button
                type="button"
                onClick={() => setEmailNotifs(!emailNotifs)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  emailNotifs ? 'bg-indigo-600 justify-end' : 'bg-slate-300 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
              </button>
            </div>
          </div>
        </div>

        {/* Privacy & Safety */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Privacy & Safety
          </span>
          <div className="rounded-2xl bg-slate-50 dark:bg-[#121833] border border-slate-200/60 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-sm font-medium">Profile Visibility</p>
                  <p className="text-xs text-slate-500">Who can see your profile</p>
                </div>
              </div>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as any)}
                className="bg-white dark:bg-[#1A2142] border border-slate-200 dark:border-slate-700 text-xs font-semibold rounded-lg px-2.5 py-1.5 outline-none cursor-pointer"
              >
                <option value="everyone">Everyone</option>
                <option value="connections">Connections only</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => setBlockedSheetOpen(true)}
              className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-sm font-medium">Blocked Users</p>
                  <p className="text-xs text-slate-500">{blockedUsers.length} blocked</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Legal & Support */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            About & Support
          </span>
          <div className="rounded-2xl bg-slate-50 dark:bg-[#121833] border border-slate-200/60 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
            <button
              type="button"
              onClick={() => setPrivacyOpen(true)}
              className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-100/60 dark:hover:bg-slate-800/60 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium">Privacy Policy</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              type="button"
              onClick={() => setTermsOpen(true)}
              className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-100/60 dark:hover:bg-slate-800/60 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium">Terms of Service</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              type="button"
              onClick={() => setHelpOpen(true)}
              className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-100/60 dark:hover:bg-slate-800/60 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium">Help & Feedback</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Account Actions */}
        <div className="space-y-3 pt-2">
          <Button
            variant="secondary"
            fullWidth
            onClick={() => setLogoutConfirmOpen(true)}
            leftIcon={<LogOut className="w-4 h-4" />}
          >
            Log out
          </Button>

          <button
            type="button"
            onClick={() => setDeleteConfirmOpen(true)}
            className="w-full text-center text-xs font-semibold text-rose-500 hover:text-rose-600 transition-colors py-2 cursor-pointer"
          >
            Delete account (Demo data)
          </button>
        </div>
      </div>

      {/* Blocked Users Bottom Sheet */}
      <BottomSheet
        isOpen={blockedSheetOpen}
        onClose={() => setBlockedSheetOpen(false)}
        title="Blocked Users"
      >
        <div className="space-y-3">
          {blockedUsers.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-6">No blocked users</p>
          ) : (
            blockedUsers.map((u) => (
              <div
                key={u.id}
                className="p-3 bg-slate-50 dark:bg-[#1A2142] rounded-2xl flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Avatar src={u.avatar} name={u.name} size="sm" />
                  <p className="text-xs font-semibold truncate">{u.name}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => unblockUser(u.id)}>
                  Unblock
                </Button>
              </div>
            ))
          )}
        </div>
      </BottomSheet>

      {/* Privacy Sheet */}
      <BottomSheet isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} title="Privacy Policy">
        <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          <p className="font-semibold text-slate-900 dark:text-white">
            1. Respecting Professional Privacy
          </p>
          <p>
            Meridian is built from the ground up for high-trust professional networking. We never sell
            your contact information, scrape your address book without consent, or display public
            ads.
          </p>
          <p className="font-semibold text-slate-900 dark:text-white">
            2. Transparent Interest-Based Matching
          </p>
          <p>
            Candidate recommendations are computed deterministically using interest overlap, goal
            alignment, and public industry seniority. Your private direct messages are never parsed
            for ad tracking.
          </p>
        </div>
      </BottomSheet>

      {/* Terms Sheet */}
      <BottomSheet isOpen={termsOpen} onClose={() => setTermsOpen(false)} title="Terms of Service">
        <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          <p className="font-semibold text-slate-900 dark:text-white">
            1. Professional Code of Conduct
          </p>
          <p>
            Every member on Meridian agrees to maintain respectful, constructive, and spam-free
            interactions. Unsolicited bulk marketing, recruiter spam, or harassment will result in
            immediate account revocation.
          </p>
          <p className="font-semibold text-slate-900 dark:text-white">
            2. Intellectual Property
          </p>
          <p>
            You retain full ownership of all work experience, case studies, and creative content you
            post to your profile.
          </p>
        </div>
      </BottomSheet>

      {/* Help Sheet */}
      <BottomSheet isOpen={helpOpen} onClose={() => setHelpOpen(false)} title="Help & Feedback">
        <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            Need help navigating Meridian or have suggestions for the matching algorithm?
          </p>
          <p>
            Contact our engineering & product team directly at{' '}
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              support@meridian.app
            </span>
          </p>
        </div>
      </BottomSheet>

      {/* Logout Confirmation */}
      <BottomSheet
        isOpen={logoutConfirmOpen}
        onClose={() => setLogoutConfirmOpen(false)}
        title="Log out of Meridian?"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            You will return to the welcome screen. Your mock session is saved in local storage.
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" fullWidth onClick={() => setLogoutConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={() => {
                setLogoutConfirmOpen(false);
                logOut();
              }}
            >
              Log out
            </Button>
          </div>
        </div>
      </BottomSheet>

      {/* Delete Account Confirmation */}
      <BottomSheet
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="Delete Account?"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            This will wipe all demo data from your browser storage and reset the prototype.
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" fullWidth onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              fullWidth
              onClick={() => {
                setDeleteConfirmOpen(false);
                deleteAccount();
              }}
            >
              Delete & Reset
            </Button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
};
