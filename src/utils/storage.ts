import {
  BOARD_SIZE,
  DIFFICULTY_INTERVAL_MS,
} from '../types/game';
import type { Difficulty, Direction, GameState, GameStatus, Position } from '../types/game';

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

export const safeRemove = (key: string): void => {
  if (lsAvailable) {
    try {
      window.localStorage.removeItem(key);
      return;
    } catch {
      // fall through to memory
    }
  }
  memoryStore.delete(key);
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

/* ------------------------------------------------------------------ */
/* Saved-game persistence                                              */
/* ------------------------------------------------------------------ */

export const GAME_STATE_KEY = 'snake.gameState.v1';
const GAME_STATE_VERSION = 1;

const DIRECTIONS: readonly Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
const STATUSES: readonly GameStatus[] = ['idle', 'playing', 'paused', 'gameover'];
const DIFFICULTIES: readonly Difficulty[] = ['slow', 'medium', 'fast'];

const isPosition = (v: unknown): v is Position =>
  !!v &&
  typeof v === 'object' &&
  Number.isInteger((v as Position).x) &&
  Number.isInteger((v as Position).y) &&
  (v as Position).x >= 0 &&
  (v as Position).x < BOARD_SIZE &&
  (v as Position).y >= 0 &&
  (v as Position).y < BOARD_SIZE;

const validateGameState = (raw: unknown): GameState | null => {
  if (!raw || typeof raw !== 'object') return null;
  const s = raw as Partial<GameState>;
  if (!Array.isArray(s.snake) || s.snake.length === 0) return null;
  if (!s.snake.every(isPosition)) return null;
  if (!isPosition(s.food)) return null;
  if (!s.direction || !DIRECTIONS.includes(s.direction)) return null;
  if (
    s.pendingDirection !== null &&
    (!s.pendingDirection || !DIRECTIONS.includes(s.pendingDirection))
  ) {
    return null;
  }
  if (!s.status || !STATUSES.includes(s.status)) return null;
  if (!s.difficulty || !DIFFICULTIES.includes(s.difficulty)) return null;
  if (typeof s.score !== 'number' || s.score < 0) return null;
  if (typeof s.highScore !== 'number' || s.highScore < 0) return null;
  if (typeof s.tickIntervalMs !== 'number' || s.tickIntervalMs <= 0) return null;
  return {
    snake: s.snake.map((p) => ({ x: p.x, y: p.y })),
    food: { x: s.food.x, y: s.food.y },
    direction: s.direction,
    pendingDirection: s.pendingDirection ?? null,
    status: s.status,
    score: Math.floor(s.score),
    highScore: Math.floor(s.highScore),
    difficulty: s.difficulty,
    tickIntervalMs: s.tickIntervalMs,
  };
};

export const loadGameState = (): GameState | null => {
  const raw = safeGet(GAME_STATE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { v?: number; state?: unknown };
    if (!parsed || parsed.v !== GAME_STATE_VERSION) return null;
    const validated = validateGameState(parsed.state);
    if (!validated) return null;
    // Never restore a finished/idle game — only an in-progress one.
    if (validated.status !== 'playing' && validated.status !== 'paused') {
      return null;
    }
    // Defensive: ensure tick interval matches the difficulty floor.
    const baseInterval = DIFFICULTY_INTERVAL_MS[validated.difficulty];
    if (validated.tickIntervalMs > baseInterval) {
      validated.tickIntervalMs = baseInterval;
    }
    return validated;
  } catch {
    return null;
  }
};

export const saveGameState = (state: GameState): void => {
  try {
    safeSet(
      GAME_STATE_KEY,
      JSON.stringify({ v: GAME_STATE_VERSION, state }),
    );
  } catch {
    // Serialization failure — ignore.
  }
};

export const clearGameState = (): void => {
  safeRemove(GAME_STATE_KEY);
};
