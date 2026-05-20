import {
  DIFFICULTY_INTERVAL_MS,
  MIN_TICK_INTERVAL_MS,
  SPEED_UP_DELTA_MS,
  SPEED_UP_EVERY,
} from '../types/game';
import type { Action, Difficulty, GameState } from '../types/game';
import {
  buildInitialSnake,
  generateFood,
  getOppositeDirection,
  isSamePosition,
  isSelfCollision,
  isWallCollision,
  moveHead,
} from './gameUtils';

export const createInitialState = (
  difficulty: Difficulty = 'medium',
  highScore = 0,
  rand: () => number = Math.random,
): GameState => {
  const snake = buildInitialSnake();
  return {
    snake,
    food: generateFood(snake, rand),
    direction: 'RIGHT',
    pendingDirection: null,
    status: 'idle',
    score: 0,
    highScore,
    difficulty,
    tickIntervalMs: DIFFICULTY_INTERVAL_MS[difficulty],
  };
};

const computeTickInterval = (difficulty: Difficulty, score: number): number => {
  const base = DIFFICULTY_INTERVAL_MS[difficulty];
  const steps = Math.floor(score / SPEED_UP_EVERY);
  return Math.max(MIN_TICK_INTERVAL_MS, base - steps * SPEED_UP_DELTA_MS);
};

export const gameReducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    case 'START': {
      const snake = buildInitialSnake();
      return {
        ...state,
        snake,
        food: generateFood(snake),
        direction: 'RIGHT',
        pendingDirection: null,
        status: 'playing',
        score: 0,
        difficulty: action.difficulty,
        tickIntervalMs: DIFFICULTY_INTERVAL_MS[action.difficulty],
      };
    }

    case 'CHANGE_DIRECTION': {
      if (state.status !== 'playing') return state;
      // Reject 180° reversal against the *committed* direction.
      if (action.direction === getOppositeDirection(state.direction)) {
        return state;
      }
      // No-op if already moving that way.
      if (action.direction === state.direction) return state;
      return { ...state, pendingDirection: action.direction };
    }

    case 'TICK': {
      if (state.status !== 'playing') return state;

      // Commit pending direction (already validated against current direction).
      const direction = state.pendingDirection ?? state.direction;

      const head = state.snake[0];
      const newHead = moveHead(head, direction);

      // Wall collision → game over.
      if (isWallCollision(newHead)) {
        return {
          ...state,
          status: 'gameover',
          highScore: Math.max(state.highScore, state.score),
        };
      }

      const willEat = isSamePosition(newHead, state.food);
      // When eating, tail stays — so include it in self-collision check.
      // When not eating, tail moves — so exclude last cell from collision check.
      const bodyForCollision = willEat
        ? state.snake
        : state.snake.slice(0, -1);

      if (isSelfCollision(newHead, bodyForCollision)) {
        return {
          ...state,
          status: 'gameover',
          highScore: Math.max(state.highScore, state.score),
        };
      }

      const newSnake = willEat
        ? [newHead, ...state.snake]
        : [newHead, ...state.snake.slice(0, -1)];

      const newScore = willEat ? state.score + 1 : state.score;
      const newFood = willEat ? generateFood(newSnake) : state.food;
      const newInterval = willEat
        ? computeTickInterval(state.difficulty, newScore)
        : state.tickIntervalMs;

      return {
        ...state,
        snake: newSnake,
        food: newFood,
        score: newScore,
        direction,
        pendingDirection: null,
        tickIntervalMs: newInterval,
      };
    }

    case 'PAUSE': {
      if (state.status !== 'playing') return state;
      return { ...state, status: 'paused' };
    }

    case 'RESUME': {
      if (state.status !== 'paused') return state;
      return { ...state, status: 'playing' };
    }

    case 'RESTART': {
      const snake = buildInitialSnake();
      return {
        ...state,
        snake,
        food: generateFood(snake),
        direction: 'RIGHT',
        pendingDirection: null,
        status: 'idle',
        score: 0,
        tickIntervalMs: DIFFICULTY_INTERVAL_MS[state.difficulty],
      };
    }

    case 'SET_HIGH_SCORE': {
      return { ...state, highScore: Math.max(state.highScore, action.value) };
    }

    default:
      return state;
  }
};
