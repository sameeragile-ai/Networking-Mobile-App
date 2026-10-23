/**
 * Safe local storage wrapper with comprehensive try/catch guards.
 * Ensures the prototype works reliably across private browsing, incognito, and iframe sandboxes.
 */

const STORAGE_PREFIX = 'meridian_app_';

export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return defaultValue;
    }
    const item = window.localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    if (item === null) return defaultValue;
    return JSON.parse(item) as T;
  } catch (error) {
    console.warn(`[Meridian Storage] Failed to load key "${key}":`, error);
    return defaultValue;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
  } catch (error) {
    console.warn(`[Meridian Storage] Failed to save key "${key}":`, error);
  }
}

export function removeFromStorage(key: string): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
  } catch (error) {
    console.warn(`[Meridian Storage] Failed to remove key "${key}":`, error);
  }
}

export function clearAllStorage(): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    const keysToRemove: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k && k.startsWith(STORAGE_PREFIX)) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach((k) => window.localStorage.removeItem(k));
  } catch (error) {
    console.warn('[Meridian Storage] Failed to clear storage:', error);
  }
}
