import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Chip } from '../components/Chip';
import { Avatar } from '../components/Avatar';
import {
  ALL_INTERESTS,
  INDUSTRIES,
  CAREER_GOALS,
  PRESET_AVATARS,
} from '../data/interests';
import { WorkExperience, Education } from '../types';
import {
  ArrowLeft,
  Upload,
  Plus,
  Trash2,
  Check,
  Briefcase,
  GraduationCap,
} from 'lucide-react';

export const EditProfile: React.FC = () => {
  const { currentUser, updateProfile, goBack, showToast } = useApp();

  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [name, setName] = useState(currentUser.name);
  const [jobTitle, setJobTitle] = useState(currentUser.jobTitle);
  const [company, setCompany] = useState(currentUser.company);
  const [industry, setIndustry] = useState(currentUser.industry);
  const [location, setLocation] = useState(currentUser.location);
  const [intro, setIntro] = useState(currentUser.intro);
  const [interests, setInterests] = useState<string[]>(currentUser.interests || []);
  const [skills, setSkills] = useState<string[]>(currentUser.skills || []);
  const [newSkill, setNewSkill] = useState('');
  const [experience, setExperience] = useState<WorkExperience[]>(currentUser.experience || []);
  const [education, setEducation] = useState<Education[]>(currentUser.education || []);
  const [goals, setGoals] = useState<string[]>(currentUser.goals || []);

  const [isSaving, setIsSaving] = useState(false);

  // New Experience modal state or inline
  const [editingExp, setEditingExp] = useState<Partial<WorkExperience> | null>(null);
  const [editingEdu, setEditingEdu] = useState<Partial<Education> | null>(null);

  // Upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const objectUrl = URL.createObjectURL(file);
      setAvatar(objectUrl);
    }
  };

  const handleAddSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    const trimmed = newSkill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const toggleInterest = (id: string) => {
    if (interests.includes(id)) {
      setInterests(interests.filter((item) => item !== id));
    } else {
      if (interests.length < 10) {
        setInterests([...interests, id]);
      }
    }
  };

  const toggleGoal = (goal: string) => {
    if (goals.includes(goal)) {
      setGoals(goals.filter((g) => g !== goal));
    } else {
      if (goals.length < 3) {
        setGoals([...goals, goal]);
      }
    }
  };

  const handleSaveExp = () => {
    if (!editingExp?.role || !editingExp?.company) return;
    if (editingExp.id) {
      setExperience(experience.map((e) => (e.id === editingExp.id ? (editingExp as WorkExperience) : e)));
    } else {
      const newEntry: WorkExperience = {
        id: `exp-${Date.now()}`,
        role: editingExp.role,
        company: editingExp.company,
        startDate: editingExp.startDate || '2023',
        endDate: editingExp.endDate || 'Present',
        description: editingExp.description,
      };
      setExperience([newEntry, ...experience]);
    }
    setEditingExp(null);
  };

  const handleDeleteExp = (id: string) => {
    setExperience(experience.filter((e) => e.id !== id));
  };

  const handleSaveEdu = () => {
    if (!editingEdu?.school || !editingEdu?.degree) return;
    if (editingEdu.id) {
      setEducation(education.map((e) => (e.id === editingEdu.id ? (editingEdu as Education) : e)));
    } else {
      const newEntry: Education = {
        id: `edu-${Date.now()}`,
        school: editingEdu.school,
        degree: editingEdu.degree,
        field: editingEdu.field || 'General',
        startYear: editingEdu.startYear || '2016',
        endYear: editingEdu.endYear || '2020',
      };
      setEducation([newEntry, ...education]);
    }
    setEditingEdu(null);
  };

  const handleDeleteEdu = (id: string) => {
    setEducation(education.filter((e) => e.id !== id));
  };

  const handleSaveAll = () => {
    if (!name.trim()) return;
    setIsSaving(true);

    setTimeout(() => {
      setIsSaving(false);
      updateProfile({
        avatar,
        name,
        jobTitle,
        company,
        industry,
        location,
        intro,
        interests,
        skills,
        experience,
        education,
        goals,
      });
      showToast('Profile updated successfully');
      goBack();
    }, 600);
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-white dark:bg-[#0B1020] text-slate-900 dark:text-white select-none overflow-hidden">
      {/* Header */}
      <header className="px-4 py-3 bg-white/80 dark:bg-[#0B1020]/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between sticky top-0 z-20">
        <button
          type="button"
          onClick={goBack}
          aria-label="Cancel"
          className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h3 className="font-display font-bold text-base">Edit Profile</h3>

        <Button
          variant="primary"
          size="sm"
          onClick={handleSaveAll}
          isLoading={isSaving}
        >
          Save
        </Button>
      </header>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-6 pb-20">
        {/* Photo Selection */}
        <div className="space-y-3 flex flex-col items-center">
          <Avatar src={avatar} name={name} size="2xl" />

          <div className="flex items-center gap-2">
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#1A2142] text-xs font-medium cursor-pointer hover:bg-slate-100">
              <Upload className="w-3.5 h-3.5 text-indigo-500" />
              <span>Upload photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex items-center gap-2 pt-1">
            {PRESET_AVATARS.map((url, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setAvatar(url)}
                className={`rounded-full p-0.5 transition-all cursor-pointer ${
                  avatar === url ? 'ring-2 ring-indigo-500 scale-105' : 'opacity-70'
                }`}
              >
                <Avatar src={url} name={`Preset ${i}`} size="xs" />
              </button>
            ))}
          </div>
        </div>

        {/* Basic Info */}
        <div className="space-y-3.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          <Input
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="Job Title"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            required
          />
          <Input
            label="Company"
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
              className="w-full h-11 bg-white dark:bg-[#121833] text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 text-base outline-none"
            >
              {INDUSTRIES.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Location (City)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        {/* Intro */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
            About Intro (Max 160 characters)
          </label>
          <div className="relative">
            <textarea
              rows={3}
              maxLength={160}
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
              className="w-full bg-white dark:bg-[#121833] text-slate-900 dark:text-white rounded-2xl border border-slate-200 dark:border-slate-700 p-3.5 text-sm outline-none resize-none"
            />
            <span className="absolute bottom-3 right-3 text-[11px] tabular-nums text-slate-400">
              {intro.length}/160
            </span>
          </div>
        </div>

        {/* Interests */}
        <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Interests ({interests.length}/10)
            </label>
            <span className="text-xs text-slate-400">Pick 3 to 10</span>
          </div>

          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto no-scrollbar p-1">
            {ALL_INTERESTS.map((item) => {
              const isSelected = interests.includes(item.id);
              return (
                <Chip
                  key={item.id}
                  label={item.label}
                  selected={isSelected}
                  onClick={() => toggleInterest(item.id)}
                />
              );
            })}
          </div>
        </div>

        {/* Skills Tag Input */}
        <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
            Core Skills
          </label>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add skill (e.g. System Design)..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={handleAddSkill}
              className="flex-1 h-10 bg-slate-50 dark:bg-[#1A2142] rounded-xl border border-slate-200 dark:border-slate-700 px-3 text-sm outline-none"
            />
            <Button variant="secondary" size="sm" onClick={handleAddSkill}>
              Add
            </Button>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {skills.map((skill) => (
              <Chip
                key={skill}
                label={skill}
                size="sm"
                onRemove={() => handleRemoveSkill(skill)}
              />
            ))}
          </div>
        </div>

        {/* Work Experience */}
        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Work Experience</span>
            </h4>
            <button
              type="button"
              onClick={() =>
                setEditingExp({ role: '', company: '', startDate: '2022', endDate: 'Present' })
              }
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Position</span>
            </button>
          </div>

          {editingExp && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#1A2142] border border-slate-200 dark:border-slate-700 space-y-3">
              <Input
                label="Role / Title"
                value={editingExp.role || ''}
                onChange={(e) => setEditingExp({ ...editingExp, role: e.target.value })}
                placeholder="e.g. Lead Engineer"
              />
              <Input
                label="Company"
                value={editingExp.company || ''}
                onChange={(e) => setEditingExp({ ...editingExp, company: e.target.value })}
                placeholder="e.g. Meridian Labs"
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  label="Start Year"
                  value={editingExp.startDate || ''}
                  onChange={(e) => setEditingExp({ ...editingExp, startDate: e.target.value })}
                  placeholder="2021"
                />
                <Input
                  label="End Year"
                  value={editingExp.endDate || ''}
                  onChange={(e) => setEditingExp({ ...editingExp, endDate: e.target.value })}
                  placeholder="Present"
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <Button variant="ghost" size="sm" onClick={() => setEditingExp(null)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" onClick={handleSaveExp}>
                  Done
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {experience.map((exp) => (
              <div
                key={exp.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-[#1A2142] border border-slate-200/60 dark:border-slate-800 flex items-center justify-between"
              >
                <div>
                  <h5 className="font-semibold text-xs text-slate-900 dark:text-white">
                    {exp.role}
                  </h5>
                  <p className="text-[11px] text-slate-500">
                    {exp.company} · {exp.startDate} – {exp.endDate}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteExp(exp.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-500 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Education</span>
            </h4>
            <button
              type="button"
              onClick={() =>
                setEditingEdu({ school: '', degree: 'B.S.', field: '', startYear: '2016', endYear: '2020' })
              }
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Degree</span>
            </button>
          </div>

          {editingEdu && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#1A2142] border border-slate-200 dark:border-slate-700 space-y-3">
              <Input
                label="Institution / University"
                value={editingEdu.school || ''}
                onChange={(e) => setEditingEdu({ ...editingEdu, school: e.target.value })}
                placeholder="e.g. Stanford University"
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  label="Degree"
                  value={editingEdu.degree || ''}
                  onChange={(e) => setEditingEdu({ ...editingEdu, degree: e.target.value })}
                  placeholder="e.g. B.S."
                />
                <Input
                  label="Field of Study"
                  value={editingEdu.field || ''}
                  onChange={(e) => setEditingEdu({ ...editingEdu, field: e.target.value })}
                  placeholder="e.g. Computer Science"
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <Button variant="ghost" size="sm" onClick={() => setEditingEdu(null)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" onClick={handleSaveEdu}>
                  Done
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {education.map((edu) => (
              <div
                key={edu.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-[#1A2142] border border-slate-200/60 dark:border-slate-800 flex items-center justify-between"
              >
                <div>
                  <h5 className="font-semibold text-xs text-slate-900 dark:text-white">
                    {edu.degree} in {edu.field}
                  </h5>
                  <p className="text-[11px] text-slate-500">
                    {edu.school} · {edu.startYear} – {edu.endYear}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteEdu(edu.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-500 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Goals */}
        <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
            Career Goals (Up to 3)
          </label>
          <div className="grid grid-cols-1 gap-2">
            {CAREER_GOALS.map((g) => {
              const isSelected = goals.includes(g);
              return (
                <button
                  key={g}
                  type="button"
                  onClick={() => toggleGoal(g)}
                  className={`p-3 rounded-xl border text-left text-xs font-medium flex items-center justify-between cursor-pointer transition-colors ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-[#121833] text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>{g}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
