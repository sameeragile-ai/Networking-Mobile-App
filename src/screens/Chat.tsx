import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Avatar } from '../components/Avatar';
import { ArrowLeft, Send, CheckCheck, Info, Check } from 'lucide-react';

export const Chat: React.FC = () => {
  const {
    activeChatUserId,
    allUsers,
    currentUser,
    conversations,
    sendMessage,
    markConversationRead,
    isTypingInChat,
    goBack,
    navigateTo,
  } = useApp();

  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const participant = useMemo(
    () => allUsers.find((u) => u.id === activeChatUserId) || allUsers[0],
    [allUsers, activeChatUserId]
  );

  const conversation = useMemo(
    () => conversations.find((c) => c.participantId === participant.id),
    [conversations, participant.id]
  );

  // Mark read on enter
  useEffect(() => {
    if (participant.id) {
      markConversationRead(participant.id);
    }
  }, [participant.id, markConversationRead]);

  // Auto-scroll to bottom
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom('auto');
  }, [conversation?.messages?.length, isTypingInChat]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const text = inputVal.trim();
    setInputVal('');
    sendMessage(participant.id, text);
  };

  const messages = conversation?.messages || [];

  return (
    <div className="relative w-full h-full flex flex-col bg-[#F7F8FC] dark:bg-[#0B1020] text-slate-900 dark:text-white overflow-hidden">
      {/* Chat Header */}
      <header className="px-4 py-3 bg-white/85 dark:bg-[#121833]/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={goBack}
            aria-label="Back"
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div
            onClick={() => navigateTo('profile-view', { userId: participant.id })}
            className="flex items-center gap-2.5 cursor-pointer min-w-0"
          >
            <Avatar
              src={participant.avatar}
              name={participant.name}
              size="sm"
              isOnline={participant.isOnline}
              showOnline
            />
            <div className="min-w-0">
              <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white truncate">
                {participant.name}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {participant.isOnline
                  ? 'Active now'
                  : participant.lastSeen
                  ? `Last seen ${participant.lastSeen}`
                  : 'Active recently'}
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigateTo('profile-view', { userId: participant.id })}
          aria-label="View user profile"
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
        >
          <Info className="w-4 h-4" />
        </button>
      </header>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3">
        {/* Date / Security Notice Pill */}
        <div className="flex justify-center my-2">
          <span className="px-3 py-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-200/60 dark:bg-slate-800/60 rounded-full select-none">
            Messages are end-to-end encrypted
          </span>
        </div>

        <AnimatePresence initial={false}>
          {messages.map((msg, index) => {
            const isMine = msg.senderId === currentUser.id;
            const isFirstInSequence =
              index === 0 || messages[index - 1]?.senderId !== msg.senderId;

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} ${
                  isFirstInSequence ? 'mt-2.5' : 'mt-1'
                }`}
              >
                <div
                  className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    isMine
                      ? 'bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#F0607A] text-white rounded-br-xs shadow-xs'
                      : 'bg-white dark:bg-[#1A2142] text-slate-900 dark:text-slate-100 rounded-bl-xs border border-slate-200/70 dark:border-slate-800/80 shadow-xs'
                  }`}
                >
                  <p className="break-words">{msg.text}</p>
                </div>

                {/* Timestamp & read tick */}
                <div
                  className={`flex items-center gap-1 mt-0.5 px-1 text-[10px] text-slate-400 select-none ${
                    isMine ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {isMine && (
                    <CheckCheck
                      className={`w-3 h-3 ${
                        msg.read ? 'text-indigo-400' : 'text-slate-400'
                      }`}
                    />
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Typing indicator with 3 bouncing dots */}
        {isTypingInChat && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="flex items-center gap-1.5 px-4 py-3 bg-white dark:bg-[#1A2142] rounded-2xl rounded-bl-xs w-16 border border-slate-200/80 dark:border-slate-800 shadow-xs"
          >
            <motion.span
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1.5 h-1.5 rounded-full bg-slate-400"
            />
            <motion.span
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }}
              className="w-1.5 h-1.5 rounded-full bg-slate-400"
            />
            <motion.span
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
              className="w-1.5 h-1.5 rounded-full bg-slate-400"
            />
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Composer Input Area */}
      <form
        onSubmit={handleSend}
        className="p-3 bg-white/95 dark:bg-[#121833]/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 flex items-center gap-2 shrink-0 pb-safe z-20"
      >
        <div className="flex-1 relative">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={`Message ${participant.name.split(' ')[0]}...`}
            className="w-full h-11 bg-slate-100 dark:bg-[#1A2142] text-slate-900 dark:text-white rounded-2xl px-4 text-base placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none border border-transparent focus:border-indigo-500"
          />
        </div>

        <AnimatePresence>
          {inputVal.trim().length > 0 && (
            <motion.button
              type="submit"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileTap={{ scale: 0.92 }}
              aria-label="Send message"
              className="w-11 h-11 rounded-2xl bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white flex items-center justify-center shrink-0 cursor-pointer shadow-md shadow-indigo-500/20"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </motion.button>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
};
