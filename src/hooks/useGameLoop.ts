import { useEffect, useReducer, useRef } from 'react';
import { gameReducer, createInitialState } from '../game/gameReducer';
import type { Action, Difficulty, Direction, GameState } from '../types/game';
import {
  clearGameState,
  loadGameState,
  loadHighScore,
  saveGameState,
  saveHighScore,
} from '../utils/storage';

const KEY_TO_DIRECTION: Record<string, Direction> = {
  ArrowUp: 'UP',
  ArrowDown: 'DOWN',
  ArrowLeft: 'LEFT',
  ArrowRight: 'RIGHT',
  w: 'UP',
  W: 'UP',
  s: 'DOWN',
  S: 'DOWN',
  a: 'LEFT',
  A: 'LEFT',
  d: 'RIGHT',
  D: 'RIGHT',
};

export interface UseGameLoopResult {
  state: GameState;
  start: (difficulty: Difficulty) => void;
  restart: () => void;
  pause: () => void;
  resume: () => void;
}

export const useGameLoop = (): UseGameLoopResult => {
  const [state, dispatch] = useReducer(
    gameReducer,
    undefined,
    () => {
      const persistedHigh = loadHighScore();
      const saved = loadGameState();
      if (saved) {
        // Always restore as paused so the player is not surprised by motion.
        return {
          ...saved,
          status: 'paused' as const,
          highScore: Math.max(saved.highScore, persistedHigh),
        };
      }
      return createInitialState('medium', persistedHigh);
    },
  );

  // Keep latest state in a ref for the rAF loop.
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Persist high score whenever it changes.
  const lastSavedHighScore = useRef(state.highScore);
  useEffect(() => {
    if (state.highScore > lastSavedHighScore.current) {
      saveHighScore(state.highScore);
      lastSavedHighScore.current = state.highScore;
    }
  }, [state.highScore]);

  // Persist in-progress game so F5 / tab close can resume.
  useEffect(() => {
    if (state.status === 'playing' || state.status === 'paused') {
      saveGameState(state);
    } else {
      // idle or gameover — discard any prior save.
      clearGameState();
    }
  }, [state]);

  // requestAnimationFrame tick loop, gated by tickIntervalMs.
  useEffect(() => {
    let rafId = 0;
    let lastTick = performance.now();

    const loop = (now: number) => {
      const current = stateRef.current;
      if (current.status === 'playing') {
        if (now - lastTick >= current.tickIntervalMs) {
          dispatch({ type: 'TICK' });
          lastTick = now;
        }
      } else {
        lastTick = now;
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Keyboard handling.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        const current = stateRef.current;
        if (current.status === 'playing') dispatch({ type: 'PAUSE' });
        else if (current.status === 'paused') dispatch({ type: 'RESUME' });
        return;
      }
      const dir = KEY_TO_DIRECTION[e.key];
      if (dir) {
        e.preventDefault();
        dispatch({ type: 'CHANGE_DIRECTION', direction: dir });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const dispatchTyped = (a: Action) => dispatch(a);
  return {
    state,
    start: (difficulty) => dispatchTyped({ type: 'START', difficulty }),
    restart: () => dispatchTyped({ type: 'RESTART' }),
    pause: () => dispatchTyped({ type: 'PAUSE' }),
    resume: () => dispatchTyped({ type: 'RESUME' }),
  };
};
