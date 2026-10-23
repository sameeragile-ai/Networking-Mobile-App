import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { BottomSheet } from '../components/BottomSheet';
import { evaluatePasswordStrength, isValidEmail } from '../lib/validation';
import { DEMO_USER } from '../data/users';
import { Eye, EyeOff, Lock, CheckCircle2 } from 'lucide-react';

export const Auth: React.FC = () => {
  const { navigateTo, updateProfile, showToast } = useApp();

  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  // Quick fill demo credentials
  const handlePrefillDemo = () => {
    setMode('login');
    setEmail('demo@meridian.app');
    setPassword('Demo1234');
  };

  // Evaluation
  const strength = evaluatePasswordStrength(password);
  const isEmailValid = isValidEmail(email);

  const isSignupValid =
    fullName.trim().length >= 2 &&
    isEmailValid &&
    strength.score >= 2 &&
    password === confirmPassword &&
    acceptedTerms;

  const isLoginValid = isEmailValid && password.length >= 4;

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignupValid || isLoading) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      updateProfile({
        name: fullName,
        email: email,
      });
      showToast('Account created successfully');
      navigateTo('onboarding');
    }, 900);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoginValid || isLoading) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (email.toLowerCase() === 'demo@meridian.app') {
        updateProfile(DEMO_USER);
        showToast('Welcome back, Alex');
        navigateTo('discover');
      } else {
        updateProfile({
          name: fullName || 'User',
          email,
        });
        showToast('Signed in successfully');
        navigateTo('discover');
      }
    }, 900);
  };

  const handleSocialAuth = (provider: 'Google' | 'Apple') => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showToast(`Authenticated with ${provider}`);
      navigateTo('onboarding');
    }, 800);
  };

  const handleSendResetLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(resetEmail)) return;
    setResetSent(true);
    setTimeout(() => {
      showToast('Reset instructions sent to your email');
      setForgotPasswordOpen(false);
      setResetSent(false);
      setResetEmail('');
    }, 1200);
  };

  return (
    <div className="relative w-full h-full flex flex-col p-6 bg-white dark:bg-[#0B1020] text-slate-900 dark:text-white overflow-y-auto no-scrollbar">
      {/* Top Header */}
      <div className="pt-2 text-center space-y-1">
        <h2 className="font-display font-bold text-2xl tracking-tight">
          {mode === 'signup' ? 'Create your profile' : 'Welcome back'}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {mode === 'signup'
            ? 'Join a network focused on mutual professional growth'
            : 'Enter your credentials to access your network'}
        </p>
      </div>

      {/* Tabs */}
      <div className="mt-5 p-1 bg-slate-100 dark:bg-[#1A2142] rounded-xl grid grid-cols-2 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setMode('signup')}
          className={`py-2 rounded-lg transition-all duration-200 cursor-pointer ${
            mode === 'signup'
              ? 'bg-white dark:bg-[#121833] text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
          }`}
        >
          Sign up
        </button>
        <button
          type="button"
          onClick={() => setMode('login')}
          className={`py-2 rounded-lg transition-all duration-200 cursor-pointer ${
            mode === 'login'
              ? 'bg-white dark:bg-[#121833] text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
          }`}
        >
          Log in
        </button>
      </div>

      {/* Demo Credentials Helper Pill */}
      <div className="mt-3.5 p-2.5 bg-indigo-50/70 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between text-xs">
        <div>
          <span className="font-semibold text-indigo-900 dark:text-indigo-300">
            Demo account:
          </span>{' '}
          <span className="text-indigo-700/80 dark:text-indigo-400 font-mono text-[11px]">
            demo@meridian.app
          </span>
        </div>
        <button
          type="button"
          onClick={handlePrefillDemo}
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
        >
          Auto-fill
        </button>
      </div>

      {/* Form Area */}
      <form
        onSubmit={mode === 'signup' ? handleSignup : handleLogin}
        className="mt-4 space-y-3.5 flex-1"
      >
        {mode === 'signup' && (
          <Input
            label="Full Name"
            placeholder="e.g. Alex Vance"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            autoComplete="name"
          />
        )}

        <Input
          label="Work Email"
          type="email"
          placeholder="name@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          inputMode="email"
        />

        <div className="space-y-1.5">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />

          {/* Animated password strength bar for signup */}
          {mode === 'signup' && password.length > 0 && (
            <div className="space-y-1 pt-1">
              <div className="flex gap-1 h-1.5 w-full">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`h-full flex-1 rounded-full transition-all duration-300 ${
                      step <= strength.score
                        ? strength.score === 1
                          ? 'bg-rose-500'
                          : strength.score === 2
                          ? 'bg-amber-500'
                          : strength.score === 3
                          ? 'bg-indigo-500'
                          : 'bg-emerald-500'
                        : 'bg-slate-200 dark:bg-slate-800'
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>Strength: {strength.label}</span>
                <span>Min 8 characters</span>
              </div>
            </div>
          )}
        </div>

        {mode === 'signup' && (
          <Input
            label="Confirm Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
            error={
              confirmPassword && password !== confirmPassword
                ? 'Passwords do not match'
                : undefined
            }
          />
        )}

        {/* Terms checkbox for signup */}
        {mode === 'signup' ? (
          <label className="flex items-start gap-2.5 pt-1 text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-0.5 rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span>
              I agree to Meridian’s{' '}
              <span className="text-indigo-600 dark:text-indigo-400 font-medium">Terms</span>{' '}
              and{' '}
              <span className="text-indigo-600 dark:text-indigo-400 font-medium">Privacy Policy</span>.
            </span>
          </label>
        ) : (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setForgotPasswordOpen(true)}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              Forgot password?
            </button>
          </div>
        )}

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="md"
            fullWidth
            isLoading={isLoading}
            disabled={mode === 'signup' ? !isSignupValid : !isLoginValid}
          >
            {mode === 'signup' ? 'Create account' : 'Log in'}
          </Button>
        </div>
      </form>

      {/* Social Logins */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2.5">
        <Button
          variant="secondary"
          size="sm"
          fullWidth
          onClick={() => handleSocialAuth('Google')}
        >
          Continue with Google
        </Button>
        <Button
          variant="secondary"
          size="sm"
          fullWidth
          onClick={() => handleSocialAuth('Apple')}
        >
          Continue with Apple
        </Button>
      </div>

      {/* Security note */}
      <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
        <Lock className="w-3 h-3 text-slate-400" />
        <span>Your data is encrypted and private.</span>
      </div>

      {/* Forgot Password Bottom Sheet */}
      <BottomSheet
        isOpen={forgotPasswordOpen}
        onClose={() => setForgotPasswordOpen(false)}
        title="Reset your password"
      >
        <form onSubmit={handleSendResetLink} className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Enter your account email and we’ll send a link to reset your password.
          </p>
          <Input
            label="Email Address"
            type="email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            placeholder="name@company.com"
            required
            autoFocus
          />
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={resetSent}
            disabled={!isValidEmail(resetEmail)}
          >
            Send reset instructions
          </Button>
        </form>
      </BottomSheet>
    </div>
  );
};
