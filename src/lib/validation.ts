export interface PasswordStrength {
  score: number; // 0 to 4
  label: 'Too weak' | 'Weak' | 'Fair' | 'Strong' | 'Very strong';
  hasMinLength: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
  hasUpperLower: boolean;
}

export function evaluatePasswordStrength(password: string): PasswordStrength {
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const hasUpperLower = /[a-z]/.test(password) && /[A-Z]/.test(password);

  let score = 0;
  if (password.length >= 6) score++;
  if (hasMinLength) score++;
  if (hasNumber || hasSpecial) score++;
  if (hasUpperLower && (hasNumber || hasSpecial)) score++;

  if (password.length === 0) {
    return {
      score: 0,
      label: 'Too weak',
      hasMinLength: false,
      hasNumber: false,
      hasSpecial: false,
      hasUpperLower: false,
    };
  }

  const labels: Record<number, PasswordStrength['label']> = {
    0: 'Too weak',
    1: 'Weak',
    2: 'Fair',
    3: 'Strong',
    4: 'Very strong',
  };

  return {
    score,
    label: labels[score] || 'Fair',
    hasMinLength,
    hasNumber,
    hasSpecial,
    hasUpperLower,
  };
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
