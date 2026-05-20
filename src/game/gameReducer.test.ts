import { describe, it, expect } from 'vitest';
import { createInitialState, gameReducer } from './gameReducer';
import { BOARD_SIZE } from '../types/game';
import type { GameState, Position } from '../types/game';

const start = (difficulty: 'slow' | 'medium' | 'fast' = 'medium'): GameState => {
  const s = createInitialState(difficulty);
  return gameReducer(s, { type: 'START', difficulty });
};

describe('gameReducer', () => {
  describe('START', () => {
    it('moves status to playing and resets score', () => {
      const s = start();
      expect(s.status).toBe('playing');
      expect(s.score).toBe(0);
      expect(s.snake.length).toBeGreaterThan(0);
    });
  });

  describe('TICK', () => {
    it('moves the snake one cell in current direction', () => {
      const s1 = start();
      const headBefore = s1.snake[0];
      const s2 = gameReducer(s1, { type: 'TICK' });
      expect(s2.snake[0]).toEqual({ x: headBefore.x + 1, y: headBefore.y });
    });

    it('snake grows by 1 when eating food', () => {
      let s = start();
      // Place food directly in front of the head.
      const head = s.snake[0];
      s = { ...s, food: { x: head.x + 1, y: head.y } };
      const before = s.snake.length;
      const s2 = gameReducer(s, { type: 'TICK' });
      expect(s2.snake.length).toBe(before + 1);
      expect(s2.score).toBe(1);
    });

    it('places a new food (not on snake) after eating', () => {
      let s = start();
      const head = s.snake[0];
      s = { ...s, food: { x: head.x + 1, y: head.y } };
      const s2 = gameReducer(s, { type: 'TICK' });
      expect(s2.snake.some((c) => c.x === s2.food.x && c.y === s2.food.y)).toBe(false);
    });

    it('triggers game over on wall collision', () => {
      let s = start();
      // Move snake to the right wall.
      const wallX = BOARD_SIZE - 1;
      const newHead: Position = { x: wallX, y: s.snake[0].y };
      s = { ...s, snake: [newHead, ...s.snake.slice(1)] };
      const s2 = gameReducer(s, { type: 'TICK' });
      expect(s2.status).toBe('gameover');
    });

    it('triggers game over on self collision', () => {
      let s = start();
      // Construct a snake that will collide with itself on next tick going UP.
      s = {
        ...s,
        direction: 'UP',
        pendingDirection: null,
        snake: [
          { x: 5, y: 5 },
          { x: 5, y: 4 },
          { x: 6, y: 4 },
          { x: 6, y: 5 },
          { x: 6, y: 6 },
        ],
      };
      // Move head UP → (5,4) which equals body cell → collision.
      const s2 = gameReducer(s, { type: 'TICK' });
      expect(s2.status).toBe('gameover');
    });

    it('does nothing when not playing', () => {
      const s = createInitialState();
      expect(gameReducer(s, { type: 'TICK' })).toBe(s);
    });

    it('persists high score on game over', () => {
      let s = start();
      s = { ...s, score: 10 };
      const wallX = BOARD_SIZE - 1;
      s = { ...s, snake: [{ x: wallX, y: s.snake[0].y }, ...s.snake.slice(1)] };
      const s2 = gameReducer(s, { type: 'TICK' });
      expect(s2.highScore).toBe(10);
    });

    it('increases speed (lower interval) at score threshold', () => {
      let s = start('medium');
      // Force score to just below the threshold and place food in front.
      const head = s.snake[0];
      s = { ...s, score: 4, food: { x: head.x + 1, y: head.y } };
      const before = s.tickIntervalMs;
      const s2 = gameReducer(s, { type: 'TICK' });
      expect(s2.score).toBe(5);
      expect(s2.tickIntervalMs).toBeLessThan(before);
    });
  });

  describe('CHANGE_DIRECTION', () => {
    it('queues a valid direction change', () => {
      const s = start();
      const s2 = gameReducer(s, { type: 'CHANGE_DIRECTION', direction: 'UP' });
      expect(s2.pendingDirection).toBe('UP');
    });

    it('rejects 180° reversal', () => {
      const s = start();
      // Current direction is RIGHT → reject LEFT.
      const s2 = gameReducer(s, { type: 'CHANGE_DIRECTION', direction: 'LEFT' });
      expect(s2.pendingDirection).toBeNull();
    });

    it('is a no-op when already moving in that direction', () => {
      const s = start();
      const s2 = gameReducer(s, { type: 'CHANGE_DIRECTION', direction: 'RIGHT' });
      expect(s2).toBe(s);
    });

    it('does nothing when not playing', () => {
      const s = createInitialState();
      const s2 = gameReducer(s, { type: 'CHANGE_DIRECTION', direction: 'UP' });
      expect(s2).toBe(s);
    });

    it('TICK commits the pending direction', () => {
      let s = start();
      s = gameReducer(s, { type: 'CHANGE_DIRECTION', direction: 'UP' });
      const headBefore = s.snake[0];
      const s2 = gameReducer(s, { type: 'TICK' });
      expect(s2.snake[0]).toEqual({ x: headBefore.x, y: headBefore.y - 1 });
      expect(s2.direction).toBe('UP');
      expect(s2.pendingDirection).toBeNull();
    });
  });

  describe('PAUSE / RESUME', () => {
    it('PAUSE moves playing → paused', () => {
      const s = start();
      expect(gameReducer(s, { type: 'PAUSE' }).status).toBe('paused');
    });
    it('PAUSE no-op when not playing', () => {
      const s = createInitialState();
      expect(gameReducer(s, { type: 'PAUSE' })).toBe(s);
    });
    it('RESUME moves paused → playing', () => {
      let s = start();
      s = gameReducer(s, { type: 'PAUSE' });
      expect(gameReducer(s, { type: 'RESUME' }).status).toBe('playing');
    });
    it('RESUME no-op when not paused', () => {
      const s = start();
      expect(gameReducer(s, { type: 'RESUME' })).toBe(s);
    });
  });

  describe('RESTART', () => {
    it('resets to idle with fresh snake and score 0', () => {
      let s = start();
      s = { ...s, score: 42, status: 'gameover' };
      const s2 = gameReducer(s, { type: 'RESTART' });
      expect(s2.status).toBe('idle');
      expect(s2.score).toBe(0);
      expect(s2.snake.length).toBeGreaterThan(0);
    });

    it('preserves highScore after restart', () => {
      let s = start();
      s = { ...s, highScore: 99 };
      const s2 = gameReducer(s, { type: 'RESTART' });
      expect(s2.highScore).toBe(99);
    });
  });

  describe('SET_HIGH_SCORE', () => {
    it('only raises high score, never lowers', () => {
      let s = createInitialState();
      s = gameReducer(s, { type: 'SET_HIGH_SCORE', value: 50 });
      expect(s.highScore).toBe(50);
      s = gameReducer(s, { type: 'SET_HIGH_SCORE', value: 30 });
      expect(s.highScore).toBe(50);
    });
  });
});
