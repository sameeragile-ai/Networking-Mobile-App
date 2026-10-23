import React, { createContext, useContext, useReducer, useEffect, ReactNode, useRef } from 'react';
import {
  User,
  ScreenId,
  MainTab,
  DeviceType,
  ConnectionRequest,
  Conversation,
  Message,
  AppNotification,
  DiscoverFilters,
} from '../types';
import {
  INITIAL_USERS,
  DEMO_USER,
  INITIAL_CONNECTION_IDS,
  INITIAL_REQUESTS,
  INITIAL_SENT_REQUESTS,
  INITIAL_NOTIFICATIONS,
} from '../data/users';
import { INITIAL_CONVERSATIONS, CANNED_REPLIES_POOL } from '../data/conversations';
import { loadFromStorage, saveToStorage, clearAllStorage } from '../lib/storage';

export interface ToastState {
  id: number;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface AppState {
  currentScreen: ScreenId;
  screenHistory: ScreenId[];
  activeTab: MainTab;
  selectedUserId: string | null;
  activeChatUserId: string | null;
  currentUser: User;
  allUsers: User[];
  connections: string[];
  incomingRequests: ConnectionRequest[];
  sentRequests: ConnectionRequest[];
  dismissedUserIds: string[];
  blockedUserIds: string[];
  conversations: Conversation[];
  notifications: AppNotification[];
  theme: 'light' | 'dark';
  deviceType: DeviceType;
  toast: ToastState | null;
  isTypingInChat: boolean;
  filters: DiscoverFilters;
  unreadNotificationsCount: number;
  unreadMessagesCount: number;
}

type Action =
  | { type: 'NAVIGATE'; payload: { screen: ScreenId; userId?: string } }
  | { type: 'GO_BACK' }
  | { type: 'SWITCH_TAB'; payload: MainTab }
  | { type: 'SET_CURRENT_USER'; payload: User }
  | { type: 'UPDATE_PROFILE'; payload: Partial<User> }
  | { type: 'SEND_CONNECTION_REQUEST'; payload: { toUserId: string; note?: string } }
  | { type: 'SIMULATE_AUTO_ACCEPT'; payload: { toUserId: string } }
  | { type: 'ACCEPT_REQUEST'; payload: { requestId: string } }
  | { type: 'DECLINE_REQUEST'; payload: { requestId: string } }
  | { type: 'WITHDRAW_SENT_REQUEST'; payload: { requestId: string } }
  | { type: 'DISMISS_USER'; payload: { userId: string } }
  | { type: 'UNDO_DISMISS_USER'; payload: { userId: string } }
  | { type: 'BLOCK_USER'; payload: { userId: string } }
  | { type: 'UNBLOCK_USER'; payload: { userId: string } }
  | { type: 'SEND_MESSAGE'; payload: { recipientId: string; text: string } }
  | { type: 'RECEIVE_REPLY'; payload: { senderId: string; text: string } }
  | { type: 'SET_TYPING'; payload: boolean }
  | { type: 'MARK_CONVERSATION_READ'; payload: { participantId: string } }
  | { type: 'DELETE_CONVERSATION'; payload: { participantId: string } }
  | { type: 'MARK_NOTIFICATIONS_READ' }
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_DEVICE_TYPE'; payload: DeviceType }
  | { type: 'SHOW_TOAST'; payload: { message: string; action?: { label: string; onClick: () => void } } }
  | { type: 'HIDE_TOAST' }
  | { type: 'SET_FILTERS'; payload: DiscoverFilters }
  | { type: 'RESET_FILTERS' }
  | { type: 'LOG_OUT' }
  | { type: 'DELETE_ACCOUNT' }
  | { type: 'RESET_DEMO' };

const INITIAL_FILTERS: DiscoverFilters = {
  industry: '',
  experienceLevel: '',
  goal: '',
  location: '',
  minMatchScore: 0,
};

function getInitialState(): AppState {
  const savedUser = loadFromStorage<User>('user', DEMO_USER);
  const savedConnections = loadFromStorage<string[]>('connections', INITIAL_CONNECTION_IDS);
  const savedIncoming = loadFromStorage<ConnectionRequest[]>('incoming_requests', INITIAL_REQUESTS);
  const savedSent = loadFromStorage<ConnectionRequest[]>('sent_requests', INITIAL_SENT_REQUESTS);
  const savedDismissed = loadFromStorage<string[]>('dismissed', []);
  const savedBlocked = loadFromStorage<string[]>('blocked', []);
  const savedConversations = loadFromStorage<Conversation[]>('conversations', INITIAL_CONVERSATIONS);
  const savedNotifications = loadFromStorage<AppNotification[]>('notifications', INITIAL_NOTIFICATIONS);
  const savedTheme = loadFromStorage<'light' | 'dark'>('theme', 'light');
  const savedDevice = loadFromStorage<DeviceType>('device_type', 'iphone');

  const unreadMessagesCount = savedConversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
  const unreadNotificationsCount = savedNotifications.filter((n) => !n.read).length;

  return {
    currentScreen: 'splash',
    screenHistory: [],
    activeTab: 'discover',
    selectedUserId: null,
    activeChatUserId: null,
    currentUser: savedUser,
    allUsers: INITIAL_USERS,
    connections: savedConnections,
    incomingRequests: savedIncoming,
    sentRequests: savedSent,
    dismissedUserIds: savedDismissed,
    blockedUserIds: savedBlocked,
    conversations: savedConversations,
    notifications: savedNotifications,
    theme: savedTheme,
    deviceType: savedDevice,
    toast: null,
    isTypingInChat: false,
    filters: INITIAL_FILTERS,
    unreadNotificationsCount,
    unreadMessagesCount,
  };
}

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'NAVIGATE': {
      const nextHistory = [...state.screenHistory, state.currentScreen];
      return {
        ...state,
        currentScreen: action.payload.screen,
        screenHistory: nextHistory,
        selectedUserId: action.payload.userId || state.selectedUserId,
        activeChatUserId:
          action.payload.screen === 'chat' && action.payload.userId
            ? action.payload.userId
            : state.activeChatUserId,
      };
    }

    case 'GO_BACK': {
      if (state.screenHistory.length === 0) {
        return { ...state, currentScreen: state.activeTab };
      }
      const prevScreen = state.screenHistory[state.screenHistory.length - 1];
      const nextHistory = state.screenHistory.slice(0, -1);
      return {
        ...state,
        currentScreen: prevScreen,
        screenHistory: nextHistory,
      };
    }

    case 'SWITCH_TAB': {
      return {
        ...state,
        activeTab: action.payload,
        currentScreen: action.payload,
        screenHistory: [],
      };
    }

    case 'SET_CURRENT_USER': {
      saveToStorage('user', action.payload);
      return { ...state, currentUser: action.payload };
    }

    case 'UPDATE_PROFILE': {
      const updatedUser = { ...state.currentUser, ...action.payload };
      saveToStorage('user', updatedUser);
      return { ...state, currentUser: updatedUser };
    }

    case 'SEND_CONNECTION_REQUEST': {
      const newReq: ConnectionRequest = {
        id: `req-${Date.now()}`,
        fromUserId: state.currentUser.id,
        toUserId: action.payload.toUserId,
        status: 'pending',
        note: action.payload.note,
        createdAt: 'Just now',
      };
      const updatedSent = [newReq, ...state.sentRequests];
      saveToStorage('sent_requests', updatedSent);
      return {
        ...state,
        sentRequests: updatedSent,
      };
    }

    case 'SIMULATE_AUTO_ACCEPT': {
      const { toUserId } = action.payload;
      const targetUser = state.allUsers.find((u) => u.id === toUserId);
      const updatedSent = state.sentRequests.filter((r) => r.toUserId !== toUserId);
      const updatedConnections = Array.from(new Set([...state.connections, toUserId]));

      const newNotif: AppNotification = {
        id: `notif-${Date.now()}`,
        title: 'Connection Accepted',
        body: `${targetUser ? targetUser.name : 'Someone'} accepted your connection request.`,
        timestamp: 'Just now',
        read: false,
        type: 'connection_accepted',
        relatedUserId: toUserId,
      };

      const updatedNotifs = [newNotif, ...state.notifications];

      saveToStorage('sent_requests', updatedSent);
      saveToStorage('connections', updatedConnections);
      saveToStorage('notifications', updatedNotifs);

      return {
        ...state,
        sentRequests: updatedSent,
        connections: updatedConnections,
        notifications: updatedNotifs,
        unreadNotificationsCount: state.unreadNotificationsCount + 1,
      };
    }

    case 'ACCEPT_REQUEST': {
      const req = state.incomingRequests.find((r) => r.id === action.payload.requestId);
      if (!req) return state;

      const newConnections = Array.from(new Set([...state.connections, req.fromUserId]));
      const remainingRequests = state.incomingRequests.filter((r) => r.id !== action.payload.requestId);

      // Create conversation if it doesn't exist
      let updatedConversations = [...state.conversations];
      const existingConv = updatedConversations.find((c) => c.participantId === req.fromUserId);
      if (!existingConv) {
        const newConv: Conversation = {
          id: `conv-${req.fromUserId}`,
          participantId: req.fromUserId,
          lastMessage: req.note || 'Connected on Meridian.',
          lastMessageTimestamp: 'Just now',
          unreadCount: 0,
          messages: req.note
            ? [
                {
                  id: `msg-${Date.now()}`,
                  senderId: req.fromUserId,
                  recipientId: state.currentUser.id,
                  text: req.note,
                  timestamp: 'Just now',
                  read: true,
                },
              ]
            : [],
        };
        updatedConversations = [newConv, ...updatedConversations];
      }

      saveToStorage('connections', newConnections);
      saveToStorage('incoming_requests', remainingRequests);
      saveToStorage('conversations', updatedConversations);

      return {
        ...state,
        connections: newConnections,
        incomingRequests: remainingRequests,
        conversations: updatedConversations,
      };
    }

    case 'DECLINE_REQUEST': {
      const remainingRequests = state.incomingRequests.filter((r) => r.id !== action.payload.requestId);
      saveToStorage('incoming_requests', remainingRequests);
      return {
        ...state,
        incomingRequests: remainingRequests,
      };
    }

    case 'WITHDRAW_SENT_REQUEST': {
      const remainingSent = state.sentRequests.filter((r) => r.id !== action.payload.requestId);
      saveToStorage('sent_requests', remainingSent);
      return {
        ...state,
        sentRequests: remainingSent,
      };
    }

    case 'DISMISS_USER': {
      const updatedDismissed = Array.from(new Set([...state.dismissedUserIds, action.payload.userId]));
      saveToStorage('dismissed', updatedDismissed);
      return {
        ...state,
        dismissedUserIds: updatedDismissed,
      };
    }

    case 'UNDO_DISMISS_USER': {
      const updatedDismissed = state.dismissedUserIds.filter((id) => id !== action.payload.userId);
      saveToStorage('dismissed', updatedDismissed);
      return {
        ...state,
        dismissedUserIds: updatedDismissed,
      };
    }

    case 'BLOCK_USER': {
      const updatedBlocked = Array.from(new Set([...state.blockedUserIds, action.payload.userId]));
      const updatedConnections = state.connections.filter((id) => id !== action.payload.userId);
      const updatedConversations = state.conversations.filter((c) => c.participantId !== action.payload.userId);
      saveToStorage('blocked', updatedBlocked);
      saveToStorage('connections', updatedConnections);
      saveToStorage('conversations', updatedConversations);
      return {
        ...state,
        blockedUserIds: updatedBlocked,
        connections: updatedConnections,
        conversations: updatedConversations,
      };
    }

    case 'UNBLOCK_USER': {
      const updatedBlocked = state.blockedUserIds.filter((id) => id !== action.payload.userId);
      saveToStorage('blocked', updatedBlocked);
      return {
        ...state,
        blockedUserIds: updatedBlocked,
      };
    }

    case 'SEND_MESSAGE': {
      const { recipientId, text } = action.payload;
      const nowStr = 'Just now';
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        senderId: state.currentUser.id,
        recipientId,
        text,
        timestamp: nowStr,
        read: true,
      };

      const existingIndex = state.conversations.findIndex((c) => c.participantId === recipientId);
      let updatedConversations: Conversation[];

      if (existingIndex >= 0) {
        const conv = state.conversations[existingIndex];
        const updated = {
          ...conv,
          lastMessage: text,
          lastMessageTimestamp: nowStr,
          messages: [...conv.messages, newMessage],
        };
        updatedConversations = [
          updated,
          ...state.conversations.filter((_, i) => i !== existingIndex),
        ];
      } else {
        const newConv: Conversation = {
          id: `conv-${recipientId}`,
          participantId: recipientId,
          lastMessage: text,
          lastMessageTimestamp: nowStr,
          unreadCount: 0,
          messages: [newMessage],
        };
        updatedConversations = [newConv, ...state.conversations];
      }

      saveToStorage('conversations', updatedConversations);
      return {
        ...state,
        conversations: updatedConversations,
      };
    }

    case 'RECEIVE_REPLY': {
      const { senderId, text } = action.payload;
      const nowStr = 'Just now';
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        senderId,
        recipientId: state.currentUser.id,
        text,
        timestamp: nowStr,
        read: state.currentScreen === 'chat' && state.activeChatUserId === senderId,
      };

      const existingIndex = state.conversations.findIndex((c) => c.participantId === senderId);
      let updatedConversations: Conversation[];

      if (existingIndex >= 0) {
        const conv = state.conversations[existingIndex];
        const isCurrentActive = state.currentScreen === 'chat' && state.activeChatUserId === senderId;
        const updated = {
          ...conv,
          lastMessage: text,
          lastMessageTimestamp: nowStr,
          unreadCount: isCurrentActive ? 0 : (conv.unreadCount || 0) + 1,
          messages: [...conv.messages, newMessage],
        };
        updatedConversations = [
          updated,
          ...state.conversations.filter((_, i) => i !== existingIndex),
        ];
      } else {
        const newConv: Conversation = {
          id: `conv-${senderId}`,
          participantId: senderId,
          lastMessage: text,
          lastMessageTimestamp: nowStr,
          unreadCount: state.currentScreen === 'chat' && state.activeChatUserId === senderId ? 0 : 1,
          messages: [newMessage],
        };
        updatedConversations = [newConv, ...state.conversations];
      }

      saveToStorage('conversations', updatedConversations);
      const unreadCount = updatedConversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

      return {
        ...state,
        conversations: updatedConversations,
        unreadMessagesCount: unreadCount,
      };
    }

    case 'SET_TYPING': {
      return { ...state, isTypingInChat: action.payload };
    }

    case 'MARK_CONVERSATION_READ': {
      const updatedConversations = state.conversations.map((c) => {
        if (c.participantId === action.payload.participantId) {
          return {
            ...c,
            unreadCount: 0,
            messages: c.messages.map((m) => ({ ...m, read: true })),
          };
        }
        return c;
      });
      saveToStorage('conversations', updatedConversations);
      const unreadCount = updatedConversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
      return {
        ...state,
        conversations: updatedConversations,
        unreadMessagesCount: unreadCount,
      };
    }

    case 'DELETE_CONVERSATION': {
      const updatedConversations = state.conversations.filter(
        (c) => c.participantId !== action.payload.participantId
      );
      saveToStorage('conversations', updatedConversations);
      const unreadCount = updatedConversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
      return {
        ...state,
        conversations: updatedConversations,
        unreadMessagesCount: unreadCount,
      };
    }

    case 'MARK_NOTIFICATIONS_READ': {
      const updatedNotifs = state.notifications.map((n) => ({ ...n, read: true }));
      saveToStorage('notifications', updatedNotifs);
      return {
        ...state,
        notifications: updatedNotifs,
        unreadNotificationsCount: 0,
      };
    }

    case 'TOGGLE_THEME': {
      const nextTheme = state.theme === 'light' ? 'dark' : 'light';
      saveToStorage('theme', nextTheme);
      return { ...state, theme: nextTheme };
    }

    case 'SET_DEVICE_TYPE': {
      saveToStorage('device_type', action.payload);
      return { ...state, deviceType: action.payload };
    }

    case 'SHOW_TOAST': {
      return {
        ...state,
        toast: {
          id: Date.now(),
          message: action.payload.message,
          action: action.payload.action,
        },
      };
    }

    case 'HIDE_TOAST': {
      return { ...state, toast: null };
    }

    case 'SET_FILTERS': {
      return { ...state, filters: action.payload };
    }

    case 'RESET_FILTERS': {
      return { ...state, filters: INITIAL_FILTERS };
    }

    case 'LOG_OUT': {
      return {
        ...state,
        currentScreen: 'welcome',
        screenHistory: [],
      };
    }

    case 'DELETE_ACCOUNT': {
      clearAllStorage();
      return {
        ...getInitialState(),
        currentScreen: 'welcome',
        screenHistory: [],
      };
    }

    case 'RESET_DEMO': {
      clearAllStorage();
      return {
        ...getInitialState(),
        currentScreen: 'splash',
        screenHistory: [],
      };
    }

    default:
      return state;
  }
}

export interface AppContextType extends AppState {
  navigateTo: (screen: ScreenId, params?: { userId?: string }) => void;
  goBack: () => void;
  switchTab: (tab: MainTab) => void;
  updateProfile: (profile: Partial<User>) => void;
  sendConnectionRequest: (toUserId: string, note?: string) => void;
  acceptRequest: (requestId: string) => void;
  declineRequest: (requestId: string) => void;
  withdrawRequest: (requestId: string) => void;
  dismissUser: (userId: string) => void;
  undoDismissUser: (userId: string) => void;
  blockUser: (userId: string) => void;
  unblockUser: (userId: string) => void;
  sendMessage: (recipientId: string, text: string) => void;
  markConversationRead: (participantId: string) => void;
  deleteConversation: (participantId: string) => void;
  markNotificationsRead: () => void;
  toggleTheme: () => void;
  setDeviceType: (device: DeviceType) => void;
  showToast: (message: string, action?: { label: string; onClick: () => void }) => void;
  hideToast: () => void;
  setFilters: (filters: DiscoverFilters) => void;
  resetFilters: () => void;
  logOut: () => void;
  deleteAccount: () => void;
  resetDemo: () => void;
  calculateCompleteness: (user: User) => { percentage: number; tips: string[] };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, undefined, getInitialState);
  const lastReplyIndexRef = useRef<number>(-1);

  // Auto-dismiss toast after 4s
  useEffect(() => {
    if (!state.toast) return;
    const timer = setTimeout(() => {
      dispatch({ type: 'HIDE_TOAST' });
    }, 4000);
    return () => clearTimeout(timer);
  }, [state.toast?.id]);

  const navigateTo = (screen: ScreenId, params?: { userId?: string }) => {
    dispatch({ type: 'NAVIGATE', payload: { screen, userId: params?.userId } });
  };

  const goBack = () => {
    dispatch({ type: 'GO_BACK' });
  };

  const switchTab = (tab: MainTab) => {
    dispatch({ type: 'SWITCH_TAB', payload: tab });
  };

  const updateProfile = (profile: Partial<User>) => {
    dispatch({ type: 'UPDATE_PROFILE', payload: profile });
  };

  const sendConnectionRequest = (toUserId: string, note?: string) => {
    dispatch({ type: 'SEND_CONNECTION_REQUEST', payload: { toUserId, note } });

    // ~40% chance of auto-accept after 4-8 seconds
    const shouldAutoAccept = Math.random() < 0.45;
    if (shouldAutoAccept) {
      const delay = Math.floor(Math.random() * 4000) + 4000;
      setTimeout(() => {
        dispatch({ type: 'SIMULATE_AUTO_ACCEPT', payload: { toUserId } });
        const user = state.allUsers.find((u) => u.id === toUserId);
        showToast(`${user ? user.name : 'Someone'} accepted your connection request!`);
      }, delay);
    }
  };

  const acceptRequest = (requestId: string) => {
    const req = state.incomingRequests.find((r) => r.id === requestId);
    const user = state.allUsers.find((u) => u.id === req?.fromUserId);
    dispatch({ type: 'ACCEPT_REQUEST', payload: { requestId } });
    showToast(`Connected with ${user ? user.name : 'new connection'}.`);
  };

  const declineRequest = (requestId: string) => {
    dispatch({ type: 'DECLINE_REQUEST', payload: { requestId } });
  };

  const withdrawRequest = (requestId: string) => {
    dispatch({ type: 'WITHDRAW_SENT_REQUEST', payload: { requestId } });
    showToast('Connection request withdrawn.');
  };

  const dismissUser = (userId: string) => {
    dispatch({ type: 'DISMISS_USER', payload: { userId } });
    showToast('Profile removed from recommendations', {
      label: 'Undo',
      onClick: () => undoDismissUser(userId),
    });
  };

  const undoDismissUser = (userId: string) => {
    dispatch({ type: 'UNDO_DISMISS_USER', payload: { userId } });
    showToast('Profile restored');
  };

  const blockUser = (userId: string) => {
    dispatch({ type: 'BLOCK_USER', payload: { userId } });
    showToast('User has been blocked');
  };

  const unblockUser = (userId: string) => {
    dispatch({ type: 'UNBLOCK_USER', payload: { userId } });
    showToast('User unblocked');
  };

  const sendMessage = (recipientId: string, text: string) => {
    dispatch({ type: 'SEND_MESSAGE', payload: { recipientId, text } });

    // Simulate realistic typing and contextual canned reply from pool
    setTimeout(() => {
      dispatch({ type: 'SET_TYPING', payload: true });

      setTimeout(() => {
        dispatch({ type: 'SET_TYPING', payload: false });

        // Pick canned reply without repeating consecutively
        let nextIndex = Math.floor(Math.random() * CANNED_REPLIES_POOL.length);
        if (nextIndex === lastReplyIndexRef.current) {
          nextIndex = (nextIndex + 1) % CANNED_REPLIES_POOL.length;
        }
        lastReplyIndexRef.current = nextIndex;
        const canned = CANNED_REPLIES_POOL[nextIndex];

        dispatch({
          type: 'RECEIVE_REPLY',
          payload: { senderId: recipientId, text: canned },
        });
      }, 1600);
    }, 900);
  };

  const markConversationRead = (participantId: string) => {
    dispatch({ type: 'MARK_CONVERSATION_READ', payload: { participantId } });
  };

  const deleteConversation = (participantId: string) => {
    dispatch({ type: 'DELETE_CONVERSATION', payload: { participantId } });
    showToast('Conversation deleted');
  };

  const markNotificationsRead = () => {
    dispatch({ type: 'MARK_NOTIFICATIONS_READ' });
  };

  const toggleTheme = () => {
    dispatch({ type: 'TOGGLE_THEME' });
  };

  const setDeviceType = (device: DeviceType) => {
    dispatch({ type: 'SET_DEVICE_TYPE', payload: device });
  };

  const showToast = (message: string, action?: { label: string; onClick: () => void }) => {
    dispatch({ type: 'SHOW_TOAST', payload: { message, action } });
  };

  const hideToast = () => {
    dispatch({ type: 'HIDE_TOAST' });
  };

  const setFilters = (filters: DiscoverFilters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  const resetFilters = () => {
    dispatch({ type: 'RESET_FILTERS' });
  };

  const logOut = () => {
    dispatch({ type: 'LOG_OUT' });
  };

  const deleteAccount = () => {
    dispatch({ type: 'DELETE_ACCOUNT' });
  };

  const resetDemo = () => {
    dispatch({ type: 'RESET_DEMO' });
  };

  const calculateCompleteness = (user: User) => {
    const checks = [
      { met: !!user.avatar, tip: 'Add a profile photo', weight: 10 },
      { met: !!user.name && user.name.length > 2, tip: 'Add your full name', weight: 10 },
      { met: !!user.jobTitle && user.jobTitle.length > 2, tip: 'Add your current job title', weight: 10 },
      { met: !!user.company, tip: 'Add your company or organization', weight: 10 },
      { met: !!user.industry, tip: 'Select your industry', weight: 10 },
      { met: !!user.location, tip: 'Add your location', weight: 10 },
      { met: !!user.intro && user.intro.length >= 20, tip: 'Write a short professional intro', weight: 10 },
      { met: user.interests && user.interests.length >= 3, tip: 'Select at least 3 interests', weight: 10 },
      { met: user.skills && user.skills.length >= 3, tip: 'Add your core skills', weight: 10 },
      { met: user.experience && user.experience.length >= 1, tip: 'Add your work experience history', weight: 5 },
      { met: user.education && user.education.length >= 1, tip: 'Add your education credentials', weight: 5 },
    ];

    let total = 0;
    const tips: string[] = [];
    for (const c of checks) {
      if (c.met) {
        total += c.weight;
      } else {
        tips.push(c.tip);
      }
    }
    return { percentage: Math.min(100, total), tips };
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        navigateTo,
        goBack,
        switchTab,
        updateProfile,
        sendConnectionRequest,
        acceptRequest,
        declineRequest,
        withdrawRequest,
        dismissUser,
        undoDismissUser,
        blockUser,
        unblockUser,
        sendMessage,
        markConversationRead,
        deleteConversation,
        markNotificationsRead,
        toggleTheme,
        setDeviceType,
        showToast,
        hideToast,
        setFilters,
        resetFilters,
        logOut,
        deleteAccount,
        resetDemo,
        calculateCompleteness,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
