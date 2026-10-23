import { Interest } from '../types';

export const INTEREST_CATEGORIES = [
  'Technology',
  'Business',
  'Creative',
  'Impact',
  'Growth',
] as const;

export const ALL_INTERESTS: Interest[] = [
  // Technology
  { id: 'ai-ml', label: 'AI & Machine Learning', category: 'Technology' },
  { id: 'product-mgmt', label: 'Product Management', category: 'Technology' },
  { id: 'cloud', label: 'Cloud Architecture', category: 'Technology' },
  { id: 'cybersecurity', label: 'Cybersecurity', category: 'Technology' },
  { id: 'web3', label: 'Web3 & Decentralization', category: 'Technology' },
  { id: 'data-science', label: 'Data Science & Analytics', category: 'Technology' },
  { id: 'ux-design', label: 'UX & Product Design', category: 'Technology' },
  { id: 'dev-tools', label: 'Developer Tools', category: 'Technology' },
  { id: 'mobile-dev', label: 'Mobile Engineering', category: 'Technology' },
  { id: 'devops', label: 'DevOps & Reliability', category: 'Technology' },

  // Business
  { id: 'startups', label: 'Startups & Early Stage', category: 'Business' },
  { id: 'venture-capital', label: 'Venture Capital', category: 'Business' },
  { id: 'marketing', label: 'Product Marketing', category: 'Business' },
  { id: 'sales', label: 'B2B Enterprise Sales', category: 'Business' },
  { id: 'strategy', label: 'Corporate Strategy', category: 'Business' },
  { id: 'ecommerce', label: 'E-commerce', category: 'Business' },
  { id: 'operations', label: 'Scale & Operations', category: 'Business' },
  { id: 'b2b-saas', label: 'B2B SaaS Growth', category: 'Business' },
  { id: 'angel-investing', label: 'Angel Investing', category: 'Business' },

  // Creative
  { id: 'branding', label: 'Brand Identity', category: 'Creative' },
  { id: 'content', label: 'Content Strategy', category: 'Creative' },
  { id: 'photography', label: 'Creative Direction', category: 'Creative' },
  { id: 'writing', label: 'Technical Writing', category: 'Creative' },
  { id: 'design-systems', label: 'Design Systems', category: 'Creative' },
  { id: 'motion-design', label: 'Motion & Interaction', category: 'Creative' },

  // Impact
  { id: 'sustainability', label: 'Sustainability', category: 'Impact' },
  { id: 'climate-tech', label: 'Climate Tech', category: 'Impact' },
  { id: 'health-tech', label: 'Health Tech & MedTech', category: 'Impact' },
  { id: 'education', label: 'EdTech & Learning', category: 'Impact' },
  { id: 'social-impact', label: 'Social Impact', category: 'Impact' },
  { id: 'clean-energy', label: 'Clean Energy & Renewables', category: 'Impact' },

  // Growth
  { id: 'leadership', label: 'Engineering Leadership', category: 'Growth' },
  { id: 'public-speaking', label: 'Public Speaking', category: 'Growth' },
  { id: 'mentorship', label: 'Mentorship', category: 'Growth' },
  { id: 'remote-work', label: 'Distributed Teams', category: 'Growth' },
  { id: 'personal-finance', label: 'Personal Wealth', category: 'Growth' },
  { id: 'team-culture', label: 'High-Performance Culture', category: 'Growth' },
];

export const CAREER_GOALS = [
  'Find a mentor',
  'Mentor others',
  'Find a co-founder',
  'Hire talent',
  'Explore new roles',
  'Grow my network',
  'Learn new skills',
  'Find investors',
] as const;

export const INDUSTRIES = [
  'Technology & Software',
  'Venture Capital & Private Equity',
  'Climate & Clean Tech',
  'Financial Services & Fintech',
  'Healthcare & Life Sciences',
  'Design & Creative Agencies',
  'Management Consulting',
  'Education & EdTech',
  'E-commerce & Consumer Goods',
  'Media & Publishing',
] as const;

export const PRESET_AVATARS = [
  'https://randomuser.me/api/portraits/women/44.jpg',
  'https://randomuser.me/api/portraits/men/32.jpg',
  'https://randomuser.me/api/portraits/women/68.jpg',
  'https://randomuser.me/api/portraits/men/46.jpg',
  'https://randomuser.me/api/portraits/women/90.jpg',
  'https://randomuser.me/api/portraits/men/86.jpg',
];

export const INTRO_PROMPT_STARTERS = [
  'Building the next generation of developer infrastructure.',
  'Passionate about building resilient teams and scaling clean tech.',
  'Looking to exchange insights on product-led growth and early-stage fundraising.',
];
