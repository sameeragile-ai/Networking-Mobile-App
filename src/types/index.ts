export type ExperienceLevel = 
  | 'Student'
  | 'Early career (0-2y)'
  | 'Mid-level (3-6y)'
  | 'Senior (7-12y)'
  | 'Executive (12y+)';

export interface WorkExperience {
  id: string;
  role: string;
  company: string;
  startDate: string;
  endDate: string; // or 'Present'
  description?: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
}

export interface Interest {
  id: string;
  label: string;
  category: 'Technology' | 'Business' | 'Creative' | 'Impact' | 'Growth';
}

export interface User {
  id: string;
  name: string;
  email?: string;
  avatar: string;
  coverGradient: string; // CSS gradient string
  jobTitle: string;
  company: string;
  industry: string;
  location: string;
  experienceLevel: ExperienceLevel;
  intro: string;
  interests: string[]; // interest IDs
  skills: string[];
  experience: WorkExperience[];
  education: Education[];
  goals: string[];
  isOnline: boolean;
  lastSeen?: string;
}

export interface MatchResult {
  candidate: User;
  score: number; // 0 to 100
  sharedInterests: string[]; // interest labels or IDs
  sharedGoals: string[];
  reason: string;
}

export interface ConnectionRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'declined';
  note?: string;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participantId: string;
  lastMessage: string;
  lastMessageTimestamp: string;
  unreadCount: number;
  messages: Message[];
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  type: 'connection_accepted' | 'connection_request' | 'message';
  relatedUserId?: string;
}

export type ScreenId = 
  | 'splash'
  | 'welcome'
  | 'auth'
  | 'onboarding'
  | 'discover'
  | 'profile-view'
  | 'network'
  | 'messages'
  | 'chat'
  | 'my-profile'
  | 'edit-profile'
  | 'settings';

export type MainTab = 'discover' | 'network' | 'messages' | 'my-profile';

export type DeviceType = 'iphone' | 'android';

export interface DiscoverFilters {
  industry: string;
  experienceLevel: string;
  goal: string;
  location: string;
  minMatchScore: number;
}
