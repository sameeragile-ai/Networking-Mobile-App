# Meridian — Professional Networking Prototype

> **"Meet people who care about what you care about."**

Meridian is a production-quality, responsive mobile professional networking web application rendered inside an interactive phone frame on desktop/tablets and seamlessly full-screen on mobile devices. Designed as a clickable client prototype for high-trust professional connections driven primarily by **shared interests and complementary career trajectories**.

---

## 1. Product Overview & Key Features

- **End-to-End Clickable Journey**:
  - **Splash Screen**: Wordmark reveal with gradient sweep and auto-advancement.
  - **Welcome Carousel**: 3-slide visual walkthrough showcasing core values with CSS/SVG abstract geometric art.
  - **Authentication**: Sign up with animated password strength meter & terms agreement; Log in with 1-tap prefilled demo credentials (`demo@meridian.app` / `Demo1234`); forgot-password sheet; dummy Google & Apple flows.
  - **Onboarding Questionnaire (5 Steps)**: Profile photo picker (upload or 6 realistic presets), job title/company/industry, interest chip selector (3–10 required across 5 categories), career goals (pick up to 3), experience level & location, and 160-char intro with prompt starters + summary preview.
  - **Discover (Feed)**: Greeting header, notifications sheet, search bar, multi-attribute filter drawer, horizontal "Top matches for you" carousel with animated circular match % rings, and "Because you're into [Interest]" sections. Cards feature up to 3 shared interests with gradient borders, natural language match rationale, dismiss action with "Undo" toast, and request triggers.
  - **Profile View**: Gradient banner, overlapping portrait, match score ring, about section, shared interests highlighted, other interests, skill tags, chronological work experience timeline, education credentials, career goals, sticky message/connect CTA, and overflow menu (Share, Report, Block).
  - **Network Management**: Segmented control with **Connections** (searchable list), **Requests** (incoming notes with Accept/Decline; ~40% chance of auto-accept after 4–8 seconds simulating live network activity), and **Sent** (pending with Withdraw action).
  - **Contextual Direct Messaging**: Conversation list with online indicators, last message, time, unread badges; chat thread with active status, primary gradient sent bubbles, date headers, read receipts, auto-scrolling, typing indicators (3 bouncing dots), and varied contextual professional canned replies from a pool.
  - **My Profile & Full Editing**: Profile completeness meter with targeted tips, full editing for photo, name, title, company, industry, location, bio, interests, skills (tag add/remove), work experience (add/edit/delete), education (add/edit/delete), and goals. Changes immediately recalculate recommendation synergies.
  - **Settings & Controls**: Dark mode toggle, push/email notification switches, profile visibility, blocked users management with unblock triggers, privacy policy, terms, support, logout, and demo reset.

---

## 2. Desktop Showcase & Native Mobile Experience

- **Desktop (>= 768px)**:
  - Deep navy backdrop (`#0B1020`) with slow-moving, blurred gradient orbs (indigo, violet, pink) and subtle grain overlay.
  - Left brand showcase panel with pure typographic wordmark, value props, and quick controls.
  - Realistic 390 × 844 logical smartphone frame with thin metallic bezel, drop shadows, physical volume/power buttons, and automatic CSS proportional scaling to guarantee breathing room on any screen height.
  - Segmented toggle to switch dynamically between **iPhone** (Dynamic Island, iOS status bar, rounded 54px corners) and **Android** (centered punch-hole camera, Android status bar, rounded 44px corners).
  - One-click "Reset demo state" button to clear localStorage and restart at the Splash screen.
- **Real Mobile (< 768px)**:
  - Frame and outer backdrop are stripped away.
  - The app renders full-screen using `100dvh` and safe-area inset margins (`env(safe-area-inset-*)`).

---

## 3. Recommendation Engine Architecture (`src/lib/matching.ts`)

Meridian calculates synergy scores between the current user $U$ and each candidate $C$ normalized on a 50–99% scale:

$$\text{Score} = 58 + 40 \times \left( 0.60 \cdot S_{\text{interests}} + 0.15 \cdot S_{\text{goals}} + 0.10 \cdot S_{\text{industry}} + 0.10 \cdot S_{\text{skills}} + 0.05 \cdot S_{\text{exp\_loc}} \right)$$

1. **Interest Similarity (60% weight)**:
   - Jaccard similarity of interest IDs: $|I_U \cap I_C| / |I_U \cup I_C|$.
   - Bonus for shared categories: $+0.05$ per shared category (capped at $+0.20$).
2. **Goal Compatibility (15% weight)**:
   - Evaluates shared goals as well as complementary pairs:
     - *"Find a mentor"* $\leftrightarrow$ *"Mentor others"*
     - *"Find a co-founder"* $\leftrightarrow$ *"Find a co-founder"*
     - *"Hire talent"* $\leftrightarrow$ *"Explore new roles"*
     - *"Find investors"* $\leftrightarrow$ any candidate in *Venture Capital & Private Equity*.
3. **Industry Synergies (10% weight)**:
   - Identical industry: $1.0$.
   - Related/adjacent industry (via bipartite adjacency matrix): $0.5$.
4. **Skills Overlap (10% weight)**:
   - Jaccard similarity of normalized skill keywords.
5. **Experience & Location (5% weight)**:
   - Same city: $+0.5$.
   - Adjacent or identical seniority level: $+0.5$.
6. **Plain-English Rationale**:
   - Generates natural sentences explaining *why* two users match (e.g. *"You both follow Climate Tech and Startups, and both want to find a co-founder"*).

---

## 4. Tech Stack

- **Framework**: React 19 + TypeScript (Vite)
- **Styling**: Tailwind CSS v4 with custom design tokens (`ink: #0B1020`, `surface: #121833`, `accent: #F0607A`, primary gradient: `#4F46E5` $\to$ `#7C3AED` $\to$ `#F0607A`)
- **Animation**: `framer-motion` (screen transitions, dynamic island, typing bubbles, match rings, spring taps)
- **Icons**: `lucide-react` (clean, neutral icons only; zero sparkle/AI icons)
- **Typography**: *Plus Jakarta Sans* (display & titles) + *Inter* (body prose)
- **State & Persistence**: React Context + `useReducer`, persisted safely to `localStorage` with try/catch guards.
- **Zero Backend / Zero External Keys**: 100% client-side execution, instant deployments.

---

## 5. Folder Structure

```
├── .env.example
├── index.html
├── package.json
├── tsconfig.json
├── vercel.json
├── vite.config.ts
├── src/
│   ├── App.tsx                      # Root component & screen transition machine
│   ├── main.tsx                     # React DOM entry
│   ├── index.css                    # Tailwind CSS v4 theme, fonts, safe area utilities
│   ├── types/
│   │   └── index.ts                 # Full TypeScript interfaces & domain types
│   ├── data/
│   │   ├── interests.ts             # 30+ categorized interests, goals, industries, avatars
│   │   ├── users.ts                 # 28 diverse realistic profiles + demo user seed
│   │   └── conversations.ts         # Pre-seeded threads & professional canned response pool
│   ├── lib/
│   │   ├── matching.ts              # Recommendation & synergy scoring algorithm
│   │   ├── storage.ts               # Safe localStorage wrapper with try/catch
│   │   └── validation.ts            # Form validation & password strength calculator
│   ├── context/
│   │   └── AppContext.tsx           # Global state, actions, auto-accept & typing simulation
│   ├── components/
│   │   ├── DeviceFrame.tsx          # 390x844 responsive phone bezel, orbs, scale engine
│   │   ├── StatusBar.tsx            # Dynamic Island (iOS) & punch-hole camera (Android)
│   │   ├── TabBar.tsx               # Floating glass tab bar with layoutId active pill
│   │   ├── Avatar.tsx               # Photo avatar with gradient initials fallback on error
│   │   ├── MatchRing.tsx            # Animated SVG circular match percentage ring
│   │   ├── Chip.tsx                 # Interactive spring chip with gradient selected state
│   │   ├── Button.tsx               # Gradient shimmer button with haptic tap response
│   │   ├── Input.tsx                # Accessible input with min-16px font to prevent zoom
│   │   ├── ProfileCard.tsx          # Card for Discover feed with match reasons & connect
│   │   ├── BottomSheet.tsx          # Drag-to-dismiss gesture drawer
│   │   ├── Toast.tsx                # Actionable floating notification (with "Undo")
│   │   ├── Skeleton.tsx             # Shimmer skeleton loader
│   │   └── EmptyState.tsx           # Clean empty state presentations
│   └── screens/
│       ├── Splash.tsx               # Splash screen with gradient sweep
│       ├── Welcome.tsx              # 3-slide value prop carousel
│       ├── Auth.tsx                 # Sign up / Log in with strength meter & demo fill
│       ├── Onboarding.tsx           # 5-step questionnaire with live progress
│       ├── Discover.tsx             # Main recommendations feed & filters
│       ├── ProfileView.tsx          # Deep candidate profile with timeline & actions
│       ├── Network.tsx              # Connections, incoming requests & sent requests
│       ├── Messages.tsx             # Conversation list with unread markers
│       ├── Chat.tsx                 # Real-time chat simulation with typing bubbles
│       ├── MyProfile.tsx            # Own profile with completeness meter
│       ├── EditProfile.tsx          # Comprehensive profile editor
│       └── Settings.tsx             # Preferences, theme, security & data reset
```

---

## 6. How to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Run local dev server (port 3000)
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build
npm run preview
```

---

## 7. Deploying to Vercel

This app contains a pre-configured `vercel.json` with single-page app rewrites:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

To deploy:
1. Push this repository to GitHub or GitLab.
2. In the Vercel dashboard, click **"New Project"** and import the repository.
3. Framework Preset: **Vite**.
4. Build Command: `npm run build`.
5. Output Directory: `dist`.
6. Click **Deploy**. No environment variables are required!

---

## 8. Replacing Mock Data with a Real Backend (Architecture Guide)

When transitioning from this clickable prototype to a production platform with persistent users, replace the following components:

### Option A: Supabase (PostgreSQL + Auth + Realtime)
1. **Authentication**: Replace `src/screens/Auth.tsx` handlers with `supabase.auth.signUp()` and `supabase.auth.signInWithPassword()`.
2. **Database Tables**:
   - `profiles`: `id (uuid)`, `name`, `job_title`, `company`, `industry`, `location`, `intro`, `interests (text[])`, `skills (text[])`.
   - `connection_requests`: `id`, `from_user_id`, `to_user_id`, `status ('pending' | 'accepted' | 'declined')`, `note`, `created_at`.
   - `messages`: `id`, `conversation_id`, `sender_id`, `recipient_id`, `text`, `created_at`, `read (bool)`.
3. **Recommendation Engine**:
   - The pure function `calculateMatch` in `src/lib/matching.ts` can be compiled into a PostgreSQL function using `pgvector` or PL/pgSQL, or executed inside a Supabase Edge Function (`/functions/recommendations`).
4. **Chat**: Replace the simulation in `src/context/AppContext.tsx` with Supabase Realtime Channels (`supabase.channel('messages').on('postgres_changes', ...)`).

### Option B: Firebase (Firestore + Firebase Auth)
1. **Authentication**: Use `firebase/auth` (`signInWithEmailAndPassword`, `createUserWithEmailAndPassword`).
2. **Firestore Collections**:
   - `/users/{userId}`: Document containing profile info, interests array, and career goals.
   - `/requests/{requestId}`: Connection requests.
   - `/conversations/{convId}/messages/{msgId}`: Chat messages with `onSnapshot` listener.
3. **Matching**: Run `getRecommendedCandidates` inside a Firebase Cloud Function or directly in the client query layer.
