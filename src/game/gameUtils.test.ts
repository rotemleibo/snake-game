import { describe, it, expect } from 'vitest';
import {
  buildInitialSnake,
  generateFood,
  getOppositeDirection,
  isSamePosition,
  isSelfCollision,
  isWallCollision,
  moveHead,
} from './gameUtils';
import { BOARD_SIZE, INITIAL_SNAKE_LENGTH } from '../types/game';
import type { Position } from '../types/game';

describe('gameUtils', () => {
  describe('isSamePosition', () => {
    it('returns true for equal positions', () => {
      expect(isSamePosition({ x: 3, y: 4 }, { x: 3, y: 4 })).toBe(true);
    });
    it('returns false for different positions', () => {
      expect(isSamePosition({ x: 3, y: 4 }, { x: 4, y: 3 })).toBe(false);
    });
  });

  describe('isWallCollision', () => {
    it.each([
      [{ x: -1, y: 0 }, true],
      [{ x: 0, y: -1 }, true],
      [{ x: BOARD_SIZE, y: 0 }, true],
      [{ x: 0, y: BOARD_SIZE }, true],
      [{ x: 0, y: 0 }, false],
      [{ x: BOARD_SIZE - 1, y: BOARD_SIZE - 1 }, false],
    ])('position %o → %s', (pos, expected) => {
      expect(isWallCollision(pos as Position)).toBe(expected);
    });
  });

  describe('isSelfCollision', () => {
    it('detects head colliding with body cell', () => {
      const body: Position[] = [
        { x: 5, y: 5 },
        { x: 5, y: 6 },
      ];
      expect(isSelfCollision({ x: 5, y: 5 }, body)).toBe(true);
    });
    it('returns false when head does not overlap body', () => {
      const body: Position[] = [
        { x: 5, y: 5 },
        { x: 5, y: 6 },
      ];
      expect(isSelfCollision({ x: 6, y: 5 }, body)).toBe(false);
    });
  });

  describe('getOppositeDirection', () => {
    it.each([
      ['UP', 'DOWN'],
      ['DOWN', 'UP'],
      ['LEFT', 'RIGHT'],
      ['RIGHT', 'LEFT'],
    ] as const)('%s → %s', (input, expected) => {
      expect(getOppositeDirection(input)).toBe(expected);
    });
  });

  describe('moveHead', () => {
    const head: Position = { x: 5, y: 5 };
    it.each([
      ['UP', { x: 5, y: 4 }],
      ['DOWN', { x: 5, y: 6 }],
      ['LEFT', { x: 4, y: 5 }],
      ['RIGHT', { x: 6, y: 5 }],
    ] as const)('%s', (dir, expected) => {
      expect(moveHead(head, dir)).toEqual(expected);
    });
  });

  describe('generateFood', () => {
    it('never spawns food on a snake cell', () => {
      const snake: Position[] = [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 2, y: 0 },
      ];
      for (let i = 0; i < 200; i++) {
        const food = generateFood(snake);
        expect(snake.some((c) => isSamePosition(c, food))).toBe(false);
      }
    });
    it('uses provided rand to pick deterministic cell', () => {
      const snake: Position[] = [{ x: 0, y: 0 }];
      const food = generateFood(snake, () => 0);
      // First free cell with deterministic 0-index → (1,0)
      expect(food).toEqual({ x: 1, y: 0 });
    });
    it('returns head position when board is full (sentinel)', () => {
      const snake: Position[] = [];
      for (let y = 0; y < BOARD_SIZE; y++) {
        for (let x = 0; x < BOARD_SIZE; x++) snake.push({ x, y });
      }
      const food = generateFood(snake);
      expect(food).toEqual(snake[0]);
    });
  });

  describe('buildInitialSnake', () => {
    it('returns the configured length', () => {
      expect(buildInitialSnake()).toHaveLength(INITIAL_SNAKE_LENGTH);
    });
    it('places head ahead of tail (head x > tail x)', () => {
      const snake = buildInitialSnake();
      expect(snake[0].x).toBeGreaterThan(snake[snake.length - 1].x);
    });
    it('all cells are on the same row', () => {
      const snake = buildInitialSnake();
      const y0 = snake[0].y;
      expect(snake.every((c) => c.y === y0)).toBe(true);
    });
  });
});
