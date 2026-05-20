/**
 * Safe localStorage wrapper. Falls back to in-memory map if localStorage
 * is unavailable (e.g. private browsing, Safari storage exceptions).
 */
const memoryStore = new Map<string, string>();

const hasLocalStorage = (): boolean => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    const probe = '__probe__';
    window.localStorage.setItem(probe, probe);
    window.localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
};

const lsAvailable = hasLocalStorage();

export const safeGet = (key: string): string | null => {
  if (lsAvailable) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return memoryStore.get(key) ?? null;
    }
  }
  return memoryStore.get(key) ?? null;
};

export const safeSet = (key: string, value: string): void => {
  if (lsAvailable) {
    try {
      window.localStorage.setItem(key, value);
      return;
    } catch {
      // fall through to memory
    }
  }
  memoryStore.set(key, value);
};

export const HIGH_SCORE_KEY = 'snake.highScore';

export const loadHighScore = (): number => {
  const raw = safeGet(HIGH_SCORE_KEY);
  if (!raw) return 0;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n >= 0 ? n : 0;
};

export const saveHighScore = (score: number): void => {
  safeSet(HIGH_SCORE_KEY, String(Math.max(0, Math.floor(score))));
};
