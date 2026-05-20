export type Position = {
  x: number;
  y: number;
};

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type GameStatus = 'idle' | 'playing' | 'paused' | 'gameover';

export type Difficulty = 'slow' | 'medium' | 'fast';

export const DIFFICULTY_INTERVAL_MS: Record<Difficulty, number> = {
  slow: 150,
  medium: 100,
  fast: 60,
};

export const BOARD_SIZE = 20;
export const CELL_SIZE_PX = 25;
export const INITIAL_SNAKE_LENGTH = 3;
export const MIN_TICK_INTERVAL_MS = 40;
export const SPEED_UP_EVERY = 5;
export const SPEED_UP_DELTA_MS = 10;

export type GameState = {
  snake: Position[]; // head is index 0
  food: Position;
  direction: Direction;
  pendingDirection: Direction | null;
  status: GameStatus;
  score: number;
  highScore: number;
  difficulty: Difficulty;
  tickIntervalMs: number;
};

export type Action =
  | { type: 'START'; difficulty: Difficulty }
  | { type: 'TICK' }
  | { type: 'CHANGE_DIRECTION'; direction: Direction }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'RESTART' }
  | { type: 'SET_HIGH_SCORE'; value: number };
