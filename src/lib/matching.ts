import { User, MatchResult, ExperienceLevel } from '../types';
import { ALL_INTERESTS } from '../data/interests';

/**
 * Related industries map for similarity weighting (0.5 credit for adjacent domains).
 */
export const RELATED_INDUSTRIES: Record<string, string[]> = {
  'Technology & Software': ['Financial Services & Fintech', 'Climate & Clean Tech', 'Design & Creative Agencies', 'Education & EdTech'],
  'Financial Services & Fintech': ['Technology & Software', 'Venture Capital & Private Equity', 'Management Consulting'],
  'Venture Capital & Private Equity': ['Technology & Software', 'Financial Services & Fintech', 'Climate & Clean Tech', 'Management Consulting'],
  'Climate & Clean Tech': ['Technology & Software', 'Venture Capital & Private Equity', 'Healthcare & Life Sciences'],
  'Healthcare & Life Sciences': ['Technology & Software', 'Climate & Clean Tech', 'Education & EdTech'],
  'Design & Creative Agencies': ['Technology & Software', 'Media & Publishing', 'E-commerce & Consumer Goods'],
  'Management Consulting': ['Financial Services & Fintech', 'Venture Capital & Private Equity', 'Technology & Software'],
  'Education & EdTech': ['Technology & Software', 'Media & Publishing', 'Design & Creative Agencies'],
  'E-commerce & Consumer Goods': ['Technology & Software', 'Design & Creative Agencies', 'Financial Services & Fintech'],
  'Media & Publishing': ['Technology & Software', 'Design & Creative Agencies', 'Education & EdTech'],
};

const EXPERIENCE_ORDER: ExperienceLevel[] = [
  'Student',
  'Early career (0-2y)',
  'Mid-level (3-6y)',
  'Senior (7-12y)',
  'Executive (12y+)',
];

/**
 * Calculates Jaccard index between two string sets: |A ∩ B| / |A ∪ B|.
 */
function jaccardSimilarity(setA: string[], setB: string[]): number {
  if (setA.length === 0 && setB.length === 0) return 0;
  const a = new Set(setA);
  const b = new Set(setB);
  let intersectionCount = 0;
  for (const item of a) {
    if (b.has(item)) {
      intersectionCount++;
    }
  }
  const unionCount = new Set([...setA, ...setB]).size;
  return unionCount === 0 ? 0 : intersectionCount / unionCount;
}

/**
 * Checks whether two goals are identical or complementary.
 */
function areGoalsCompatible(goalA: string, goalB: string, candidate: User): boolean {
  if (goalA === goalB) return true;
  if (
    (goalA === 'Find a mentor' && goalB === 'Mentor others') ||
    (goalA === 'Mentor others' && goalB === 'Find a mentor')
  ) {
    return true;
  }
  if (
    (goalA === 'Hire talent' && goalB === 'Explore new roles') ||
    (goalA === 'Explore new roles' && goalB === 'Hire talent')
  ) {
    return true;
  }
  if (goalA === 'Find investors' && candidate.industry.includes('Venture Capital')) {
    return true;
  }
  return false;
}

/**
 * Checks if experience levels are the same or directly adjacent.
 */
function isAdjacentExperience(expA: ExperienceLevel, expB: ExperienceLevel): boolean {
  const indexA = EXPERIENCE_ORDER.indexOf(expA);
  const indexB = EXPERIENCE_ORDER.indexOf(expB);
  if (indexA === -1 || indexB === -1) return false;
  return Math.abs(indexA - indexB) <= 1;
}

/**
 * Helper to get clean city name from a location string like "San Francisco, CA".
 */
function extractCity(location: string): string {
  return location.split(',')[0].trim().toLowerCase();
}

/**
 * Generates an articulate, human-written reason explaining the match.
 */
export function generateMatchReason(
  user: User,
  candidate: User,
  sharedInterestsLabels: string[],
  sharedGoals: string[]
): string {
  const interestCount = sharedInterestsLabels.length;
  const isSameIndustry = user.industry === candidate.industry;

  if (interestCount >= 2 && sharedGoals.length > 0) {
    const primaryInterest = sharedInterestsLabels[0];
    const secondaryInterest = sharedInterestsLabels[1];
    return `You both follow ${primaryInterest} and ${secondaryInterest}, and both want to ${sharedGoals[0].toLowerCase()}.`;
  }

  if (interestCount >= 2) {
    return `Shared focus on ${sharedInterestsLabels[0]} and ${sharedInterestsLabels[1]} across ${isSameIndustry ? 'the same industry' : 'complementary fields'}.`;
  }

  if (interestCount === 1 && sharedGoals.length > 0) {
    return `Both immersed in ${sharedInterestsLabels[0]}, with aligned goal to ${sharedGoals[0].toLowerCase()}.`;
  }

  if (interestCount === 1) {
    return `Common interest in ${sharedInterestsLabels[0]} and similar experience trajectory in ${candidate.location}.`;
  }

  if (isSameIndustry) {
    return `Strong industry synergy in ${candidate.industry} with complementary skill sets.`;
  }

  return `High network compatibility based on shared professional goals and skills.`;
}

/**
 * Computes match score and breakdown between current user and a candidate.
 * Returns score normalized between 55 and 99 for realistic UI presentation.
 */
export function calculateMatch(user: User, candidate: User): MatchResult {
  // 1. Interest Similarity (weight: 0.60)
  const interestJaccard = jaccardSimilarity(user.interests, candidate.interests);

  // Bonus for shared categories:
  const userCategories = new Set(
    user.interests.map((id) => ALL_INTERESTS.find((i) => i.id === id)?.category).filter(Boolean)
  );
  const candidateCategories = new Set(
    candidate.interests.map((id) => ALL_INTERESTS.find((i) => i.id === id)?.category).filter(Boolean)
  );
  let categoryOverlapCount = 0;
  for (const cat of userCategories) {
    if (candidateCategories.has(cat)) categoryOverlapCount++;
  }
  const categoryBonus = Math.min(0.2, categoryOverlapCount * 0.05);
  const interestScore = Math.min(1.0, interestJaccard + categoryBonus);

  // 2. Goal Compatibility (weight: 0.15)
  let goalMatches = 0;
  const matchedGoals: string[] = [];
  for (const ug of user.goals) {
    for (const cg of candidate.goals) {
      if (areGoalsCompatible(ug, cg, candidate)) {
        goalMatches++;
        matchedGoals.push(ug);
        break;
      }
    }
  }
  const maxGoals = Math.max(1, Math.min(user.goals.length, candidate.goals.length));
  const goalScore = Math.min(1.0, goalMatches / maxGoals);

  // 3. Industry Match (weight: 0.10)
  let industryScore = 0;
  if (user.industry === candidate.industry) {
    industryScore = 1.0;
  } else if (RELATED_INDUSTRIES[user.industry]?.includes(candidate.industry)) {
    industryScore = 0.5;
  }

  // 4. Skills Overlap (weight: 0.10)
  const skillsScore = jaccardSimilarity(
    user.skills.map((s) => s.toLowerCase()),
    candidate.skills.map((s) => s.toLowerCase())
  );

  // 5. Experience & Location (weight: 0.05)
  let expLocScore = 0;
  if (extractCity(user.location) === extractCity(candidate.location)) {
    expLocScore += 0.5;
  }
  if (isAdjacentExperience(user.experienceLevel, candidate.experienceLevel)) {
    expLocScore += 0.5;
  }

  // Total weighted raw score: 0 to 1
  const rawScore =
    interestScore * 0.6 +
    goalScore * 0.15 +
    industryScore * 0.1 +
    skillsScore * 0.1 +
    expLocScore * 0.05;

  // Scale rawScore to a realistic consumer percentage (62% - 98%)
  const score = Math.round(58 + rawScore * 40);

  // Collect shared interest labels
  const sharedInterestIds = user.interests.filter((id) => candidate.interests.includes(id));
  const sharedInterests = sharedInterestIds
    .map((id) => ALL_INTERESTS.find((i) => i.id === id)?.label || id)
    .filter(Boolean);

  const reason = generateMatchReason(user, candidate, sharedInterests, matchedGoals);

  return {
    candidate,
    score: Math.min(99, Math.max(50, score)),
    sharedInterests,
    sharedGoals: Array.from(new Set(matchedGoals)),
    reason,
  };
}

/**
 * Filter and sort candidates against current user.
 */
export function getRecommendedCandidates(
  user: User,
  allCandidates: User[],
  options: {
    connectedIds?: string[];
    sentRequestIds?: string[];
    dismissedIds?: string[];
    blockedIds?: string[];
    industryFilter?: string;
    experienceFilter?: string;
    goalFilter?: string;
    locationFilter?: string;
    minScore?: number;
    searchQuery?: string;
  } = {}
): MatchResult[] {
  const {
    connectedIds = [],
    sentRequestIds = [],
    dismissedIds = [],
    blockedIds = [],
    industryFilter,
    experienceFilter,
    goalFilter,
    locationFilter,
    minScore = 0,
    searchQuery = '',
  } = options;

  const excludedIds = new Set([
    user.id,
    ...connectedIds,
    ...sentRequestIds,
    ...dismissedIds,
    ...blockedIds,
  ]);

  const query = searchQuery.trim().toLowerCase();

  const results: MatchResult[] = [];

  for (const candidate of allCandidates) {
    if (excludedIds.has(candidate.id)) continue;

    if (industryFilter && candidate.industry !== industryFilter) continue;
    if (experienceFilter && candidate.experienceLevel !== experienceFilter) continue;
    if (goalFilter && !candidate.goals.includes(goalFilter)) continue;
    if (locationFilter && !candidate.location.toLowerCase().includes(locationFilter.toLowerCase())) {
      continue;
    }

    if (query) {
      const haystack = [
        candidate.name,
        candidate.jobTitle,
        candidate.company,
        candidate.industry,
        candidate.location,
        candidate.intro,
        ...candidate.skills,
        ...candidate.interests.map((id) => ALL_INTERESTS.find((i) => i.id === id)?.label || id),
      ]
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(query)) continue;
    }

    const match = calculateMatch(user, candidate);
    if (match.score >= minScore) {
      results.push(match);
    }
  }

  return results.sort((a, b) => b.score - a.score);
}
