import { BOARD_SIZE, INITIAL_SNAKE_LENGTH } from '../types/game';
import type { Direction, Position } from '../types/game';

export const isSamePosition = (a: Position, b: Position): boolean =>
  a.x === b.x && a.y === b.y;

export const isWallCollision = (pos: Position): boolean =>
  pos.x < 0 || pos.y < 0 || pos.x >= BOARD_SIZE || pos.y >= BOARD_SIZE;

export const isSelfCollision = (head: Position, body: Position[]): boolean =>
  body.some((cell) => isSamePosition(cell, head));

export const getOppositeDirection = (dir: Direction): Direction => {
  switch (dir) {
    case 'UP':
      return 'DOWN';
    case 'DOWN':
      return 'UP';
    case 'LEFT':
      return 'RIGHT';
    case 'RIGHT':
      return 'LEFT';
  }
};

export const moveHead = (head: Position, direction: Direction): Position => {
  switch (direction) {
    case 'UP':
      return { x: head.x, y: head.y - 1 };
    case 'DOWN':
      return { x: head.x, y: head.y + 1 };
    case 'LEFT':
      return { x: head.x - 1, y: head.y };
    case 'RIGHT':
      return { x: head.x + 1, y: head.y };
  }
};

/**
 * Generates a food position never overlapping with the snake.
 * Uses the provided random source (default Math.random) for testability.
 */
export const generateFood = (
  snake: Position[],
  rand: () => number = Math.random,
): Position => {
  const occupied = new Set(snake.map((p) => `${p.x},${p.y}`));
  const free: Position[] = [];
  for (let y = 0; y < BOARD_SIZE; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      if (!occupied.has(`${x},${y}`)) free.push({ x, y });
    }
  }
  if (free.length === 0) {
    // Board full — snake has won. Return head position as sentinel.
    return snake[0];
  }
  const idx = Math.floor(rand() * free.length);
  return free[idx];
};

export const buildInitialSnake = (): Position[] => {
  const centerY = Math.floor(BOARD_SIZE / 2);
  const startX = Math.floor(BOARD_SIZE / 2) - 1;
  const snake: Position[] = [];
  for (let i = 0; i < INITIAL_SNAKE_LENGTH; i++) {
    snake.push({ x: startX - i, y: centerY });
  }
  return snake; // head at index 0, facing RIGHT
};
