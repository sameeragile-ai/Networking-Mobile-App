import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Chip } from '../components/Chip';
import { Avatar } from '../components/Avatar';
import {
  ALL_INTERESTS,
  INTEREST_CATEGORIES,
  CAREER_GOALS,
  INDUSTRIES,
  PRESET_AVATARS,
  INTRO_PROMPT_STARTERS,
} from '../data/interests';
import { ExperienceLevel } from '../types';
import { ArrowLeft, Upload, CheckCircle2, Search, MapPin, Briefcase } from 'lucide-react';

export const Onboarding: React.FC = () => {
  const { currentUser, updateProfile, navigateTo } = useApp();

  const [step, setStep] = useState(1);
  const totalSteps = 5;

  // Step 1: Basics
  const [selectedAvatar, setSelectedAvatar] = useState(currentUser.avatar || PRESET_AVATARS[0]);
  const [jobTitle, setJobTitle] = useState(currentUser.jobTitle || 'Product Manager');
  const [company, setCompany] = useState(currentUser.company || 'TechCorp');
  const [industry, setIndustry] = useState(currentUser.industry || INDUSTRIES[0]);
  const [industrySearch, setIndustrySearch] = useState('');

  // Step 2: Interests (3-10 required)
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    currentUser.interests?.length ? currentUser.interests : ['ai-ml', 'product-mgmt', 'cloud']
  );
  const [interestSearch, setInterestSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Step 3: Career Goals (up to 3)
  const [selectedGoals, setSelectedGoals] = useState<string[]>(
    currentUser.goals?.length ? currentUser.goals : ['Find a co-founder', 'Grow my network']
  );

  // Step 4: Experience
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(
    currentUser.experienceLevel || 'Mid-level (3-6y)'
  );
  const [location, setLocation] = useState(currentUser.location || 'San Francisco, CA');

  // Step 5: Intro
  const [intro, setIntro] = useState(
    currentUser.intro || 'Building scalable developer platforms and distributed architecture.'
  );

  // Finish Screen state
  const [isFinished, setIsFinished] = useState(false);

  // Handle image upload from device
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const objectUrl = URL.createObjectURL(file);
      setSelectedAvatar(objectUrl);
    }
  };

  const toggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      setSelectedInterests(selectedInterests.filter((item) => item !== id));
    } else {
      if (selectedInterests.length < 10) {
        setSelectedInterests([...selectedInterests, id]);
      }
    }
  };

  const toggleGoal = (goal: string) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter((g) => g !== goal));
    } else {
      if (selectedGoals.length < 3) {
        setSelectedGoals([...selectedGoals, goal]);
      }
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Complete onboarding
      updateProfile({
        avatar: selectedAvatar,
        jobTitle,
        company,
        industry,
        interests: selectedInterests,
        goals: selectedGoals,
        experienceLevel,
        location,
        intro,
      });
      setIsFinished(true);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Filtered interests
  const filteredInterests = ALL_INTERESTS.filter((item) => {
    const matchesSearch = item.label.toLowerCase().includes(interestSearch.toLowerCase());
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Finish screen preview
  if (isFinished) {
    return (
      <div className="relative w-full h-full flex flex-col justify-between p-6 bg-white dark:bg-[#0B1020] text-slate-900 dark:text-white select-none overflow-y-auto no-scrollbar">
        <div className="pt-6 text-center space-y-2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 15, stiffness: 300 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-pink-500 mx-auto flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 mb-3"
          >
            <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
          </motion.div>
          <h2 className="font-display font-bold text-2xl tracking-tight">
            Your profile is ready
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
            We’ve calibrated your discovery feed based on your interests and career trajectory.
          </p>
        </div>

        {/* Profile Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="my-auto bg-slate-50 dark:bg-[#121833] rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4"
        >
          <div className="flex items-center gap-3.5">
            <Avatar src={selectedAvatar} name={currentUser.name} size="xl" />
            <div className="min-w-0 flex-1">
              <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white truncate">
                {currentUser.name}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium truncate">
                {jobTitle} {company ? `at ${company}` : ''}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {location} · {industry}
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic bg-white dark:bg-[#1A2142] p-3 rounded-xl border border-slate-100 dark:border-slate-800">
            "{intro}"
          </p>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {selectedInterests.slice(0, 4).map((id) => {
              const label = ALL_INTERESTS.find((i) => i.id === id)?.label || id;
              return <Chip key={id} label={label} size="sm" highlighted />;
            })}
          </div>
        </motion.div>

        <div className="pt-4">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => navigateTo('discover')}
          >
            See your matches
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-6 bg-white dark:bg-[#0B1020] text-slate-900 dark:text-white overflow-hidden">
      {/* Header & Progress Bar */}
      <div>
        <div className="flex items-center justify-between pb-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <span className="font-display font-bold text-lg text-indigo-600 dark:text-indigo-400">
              Meridian
            </span>
          )}

          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 tabular-nums">
            Step {step} of {totalSteps}
          </span>
        </div>

        {/* Gradient Progress Bar */}
        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(step / totalSteps) * 100}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"
          />
        </div>
      </div>

      {/* Step Content Container */}
      <div className="flex-1 my-4 overflow-y-auto no-scrollbar pr-1">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4 pt-1"
            >
              <div className="space-y-1">
                <h3 className="font-display font-bold text-xl tracking-tight">
                  Let’s start with the basics
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Choose a portrait or upload your own photo.
                </p>
              </div>

              {/* Avatar Selector */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-center gap-3">
                  <Avatar src={selectedAvatar} name={currentUser.name} size="2xl" />
                  <label className="flex flex-col items-center justify-center w-20 h-20 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 text-slate-400 hover:text-indigo-500 cursor-pointer transition-colors text-xs font-medium gap-1">
                    <Upload className="w-4 h-4" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex items-center justify-center gap-2 pt-1">
                  {PRESET_AVATARS.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedAvatar(url)}
                      className={`rounded-full p-0.5 transition-all cursor-pointer ${
                        selectedAvatar === url
                          ? 'ring-2 ring-indigo-500 scale-105'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <Avatar src={url} name={`Preset ${idx}`} size="sm" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Inputs */}
              <div className="space-y-3 pt-2">
                <Input
                  label="Current Role / Job Title"
                  placeholder="e.g. Staff Software Engineer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  required
                />
                <Input
                  label="Company or Organization (Optional)"
                  placeholder="e.g. Stripe or Stealth"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                    Industry
                  </label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full h-11 bg-white dark:bg-[#121833] text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 text-base focus:border-indigo-500 outline-none"
                  >
                    {INDUSTRIES.map((ind) => (
                      <option key={ind} value={ind} className="bg-white dark:bg-[#121833]">
                        {ind}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4 pt-1"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-xl tracking-tight">
                    What are your interests?
                  </h3>
                  <span
                    className={`text-xs font-semibold tabular-nums ${
                      selectedInterests.length >= 3 && selectedInterests.length <= 10
                        ? 'text-emerald-500'
                        : 'text-amber-500'
                    }`}
                  >
                    {selectedInterests.length}/10 (min 3)
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select 3 to 10 interests. Matching is powered primarily by these choices.
                </p>
              </div>

              {/* Search Bar */}
              <Input
                placeholder="Search interests..."
                value={interestSearch}
                onChange={(e) => setInterestSearch(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
              />

              {/* Category Filter bar */}
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
                <button
                  type="button"
                  onClick={() => setActiveCategory('All')}
                  className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap cursor-pointer transition-colors ${
                    activeCategory === 'All'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-[#1A2142] text-slate-600 dark:text-slate-300'
                  }`}
                >
                  All
                </button>
                {INTEREST_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap cursor-pointer transition-colors ${
                      activeCategory === cat
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-[#1A2142] text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Chip Cloud */}
              <div className="flex flex-wrap gap-2 pt-1">
                {filteredInterests.map((interest) => {
                  const isSelected = selectedInterests.includes(interest.id);
                  return (
                    <Chip
                      key={interest.id}
                      label={interest.label}
                      selected={isSelected}
                      onClick={() => toggleInterest(interest.id)}
                    />
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4 pt-1"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-xl tracking-tight">
                    What are your goals?
                  </h3>
                  <span className="text-xs font-semibold text-slate-500 tabular-nums">
                    {selectedGoals.length}/3
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Pick up to 3 goals. We match complementary intentions (e.g. mentor & mentee).
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2.5 pt-2">
                {CAREER_GOALS.map((goal) => {
                  const isSelected = selectedGoals.includes(goal);
                  return (
                    <motion.button
                      key={goal}
                      type="button"
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleGoal(goal)}
                      className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 ring-1 ring-indigo-500/30'
                          : 'border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#121833] text-slate-800 dark:text-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-sm font-medium">{goal}</span>
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${
                          isSelected
                            ? 'bg-indigo-600 border-indigo-600 text-white'
                            : 'border-slate-300 dark:border-slate-600'
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4 pt-1"
            >
              <div className="space-y-1">
                <h3 className="font-display font-bold text-xl tracking-tight">
                  Experience & Location
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Helps us calibrate relevant seniority and regional networks.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <Input
                  label="Primary City"
                  placeholder="e.g. San Francisco, CA"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  leftIcon={<MapPin className="w-4 h-4" />}
                  required
                />

                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                    Experience Level
                  </label>
                  <div className="space-y-2">
                    {[
                      'Student',
                      'Early career (0-2y)',
                      'Mid-level (3-6y)',
                      'Senior (7-12y)',
                      'Executive (12y+)',
                    ].map((lvl) => {
                      const isSelected = experienceLevel === lvl;
                      return (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setExperienceLevel(lvl as ExperienceLevel)}
                          className={`w-full p-3 rounded-xl border text-left text-sm font-medium transition-all cursor-pointer ${
                            isSelected
                              ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 ring-1 ring-indigo-500/30'
                              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-[#121833] text-slate-700 dark:text-slate-300 hover:border-slate-300'
                          }`}
                        >
                          {lvl}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4 pt-1"
            >
              <div className="space-y-1">
                <h3 className="font-display font-bold text-xl tracking-tight">
                  Craft your short intro
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  A concise 1 to 2 sentence summary of what you’re currently building or seeking.
                </p>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="relative">
                  <textarea
                    rows={4}
                    maxLength={160}
                    value={intro}
                    onChange={(e) => setIntro(e.target.value)}
                    placeholder="Tell peers what drives you..."
                    className="w-full bg-white dark:bg-[#121833] text-slate-900 dark:text-white rounded-2xl border border-slate-200 dark:border-slate-700/80 p-3.5 text-sm focus:border-indigo-500 outline-none resize-none leading-relaxed"
                  />
                  <span
                    className={`absolute bottom-3 right-3 text-[11px] tabular-nums font-semibold ${
                      intro.length > 140 ? 'text-amber-500' : 'text-slate-400'
                    }`}
                  >
                    {intro.length}/160
                  </span>
                </div>
              </div>

              {/* Tappable prompt starters */}
              <div className="space-y-2 pt-1">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                  Or tap a prompt starter:
                </span>
                <div className="space-y-1.5">
                  {INTRO_PROMPT_STARTERS.map((starter, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setIntro(starter)}
                      className="w-full text-left p-2.5 rounded-xl bg-slate-50 dark:bg-[#1A2142] hover:bg-slate-100 dark:hover:bg-[#252E58] border border-slate-200/60 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                    >
                      "{starter}"
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Sticky Action Area */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleNext}
          disabled={step === 2 && selectedInterests.length < 3}
        >
          {step === totalSteps ? 'Complete setup' : 'Continue'}
        </Button>
      </div>
    </div>
  );
};
