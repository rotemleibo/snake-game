import { useEffect, useRef } from 'react';
import { BOARD_SIZE, CELL_SIZE_PX } from '../types/game';
import type { GameState } from '../types/game';

interface GameCanvasProps {
  state: GameState;
}

const BG_COLOR = '#0a0a0f';
const GRID_COLOR = '#15151f';
const FOOD_COLOR = '#ff073a';
const FOOD_GLOW = 'rgba(255, 7, 58, 0.55)';

const drawCell = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string,
  radius = 4,
) => {
  const px = x * CELL_SIZE_PX;
  const py = y * CELL_SIZE_PX;
  const size = CELL_SIZE_PX - 2;
  ctx.fillStyle = color;
  ctx.beginPath();
  // roundRect not supported in jsdom; guard.
  if (typeof (ctx as unknown as { roundRect?: unknown }).roundRect === 'function') {
    (ctx as unknown as {
      roundRect: (x: number, y: number, w: number, h: number, r: number) => void;
    }).roundRect(px + 1, py + 1, size, size, radius);
    ctx.fill();
  } else {
    ctx.fillRect(px + 1, py + 1, size, size);
  }
};

const snakeColorForIndex = (i: number, total: number): string => {
  // Gradient: bright neon green at head → dim teal at tail.
  const t = total === 1 ? 0 : i / (total - 1);
  const r = Math.round(57 - 57 * t);
  const g = Math.round(255 - 100 * t);
  const b = Math.round(20 + 80 * t);
  return `rgb(${r}, ${g}, ${b})`;
};

export const GameCanvas = ({ state }: GameCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pulseRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = BOARD_SIZE * CELL_SIZE_PX;
    const H = BOARD_SIZE * CELL_SIZE_PX;

    // Background.
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, W, H);

    // Grid lines.
    ctx.strokeStyle = GRID_COLOR;
    ctx.lineWidth = 1;
    for (let i = 0; i <= BOARD_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE_PX, 0);
      ctx.lineTo(i * CELL_SIZE_PX, H);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE_PX);
      ctx.lineTo(W, i * CELL_SIZE_PX);
      ctx.stroke();
    }

    // Food with glow.
    pulseRef.current = (pulseRef.current + 1) % 1000;
    const glowAmount = 8 + 4 * Math.sin(pulseRef.current / 8);
    ctx.save();
    ctx.shadowColor = FOOD_GLOW;
    ctx.shadowBlur = glowAmount;
    drawCell(ctx, state.food.x, state.food.y, FOOD_COLOR, 8);
    ctx.restore();

    // Snake.
    state.snake.forEach((cell, i) => {
      const color = snakeColorForIndex(i, state.snake.length);
      if (i === 0) {
        ctx.save();
        ctx.shadowColor = 'rgba(57, 255, 20, 0.85)';
        ctx.shadowBlur = 12;
        drawCell(ctx, cell.x, cell.y, color, 6);
        ctx.restore();
      } else {
        drawCell(ctx, cell.x, cell.y, color, 4);
      }
    });

    // Paused overlay.
    if (state.status === 'paused') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#39ff14';
      ctx.font = 'bold 36px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('PAUSED', W / 2, H / 2);
    }
  }, [state]);

  return (
    <canvas
      ref={canvasRef}
      width={BOARD_SIZE * CELL_SIZE_PX}
      height={BOARD_SIZE * CELL_SIZE_PX}
      className="rounded-lg border border-board-grid shadow-neon"
      role="img"
      aria-label={`Snake board, score ${state.score}`}
    />
  );
};
