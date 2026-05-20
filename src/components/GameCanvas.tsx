import { useEffect, useRef } from 'react';
import { BOARD_SIZE, CELL_SIZE_PX } from '../types/game';
import type { Direction, GameState, Position } from '../types/game';

const BG_GRADIENT_TOP = '#0b1020';
const BG_GRADIENT_BOTTOM = '#131a33';
const GRID_COLOR = 'rgba(255, 255, 255, 0.04)';

const BODY_DARK = '#0e6b3a';
const BODY_LIGHT = '#3ddc84';
const BODY_HIGHLIGHT = '#a8ffce';
const SCALE_DOT = 'rgba(0, 0, 0, 0.25)';

const MOUSE_BODY = '#9ca3af';
const MOUSE_BODY_DARK = '#4b5563';
const MOUSE_EAR_INNER = '#f9a8d4';
const MOUSE_NOSE = '#ec4899';
const MOUSE_EYE = '#0f172a';

interface GameCanvasProps {
  state: GameState;
}

const directionToAngle = (d: Direction): number => {
  switch (d) {
    case 'RIGHT':
      return 0;
    case 'DOWN':
      return Math.PI / 2;
    case 'LEFT':
      return Math.PI;
    case 'UP':
      return -Math.PI / 2;
  }
};

const centerOf = (p: Position): { cx: number; cy: number } => ({
  cx: p.x * CELL_SIZE_PX + CELL_SIZE_PX / 2,
  cy: p.y * CELL_SIZE_PX + CELL_SIZE_PX / 2,
});

const drawBackground = (ctx: CanvasRenderingContext2D, W: number, H: number) => {
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, BG_GRADIENT_TOP);
  grad.addColorStop(1, BG_GRADIENT_BOTTOM);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = GRID_COLOR;
  ctx.lineWidth = 1;
  for (let i = 0; i <= BOARD_SIZE; i++) {
    ctx.beginPath();
    ctx.moveTo(i * CELL_SIZE_PX + 0.5, 0);
    ctx.lineTo(i * CELL_SIZE_PX + 0.5, H);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i * CELL_SIZE_PX + 0.5);
    ctx.lineTo(W, i * CELL_SIZE_PX + 0.5);
    ctx.stroke();
  }
};

const strokeAlongSnake = (
  ctx: CanvasRenderingContext2D,
  snake: Position[],
  color: string,
  width: number,
  alpha = 1,
) => {
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.globalAlpha = alpha;
  ctx.beginPath();
  snake.forEach((seg, i) => {
    const { cx, cy } = centerOf(seg);
    if (i === 0) ctx.moveTo(cx, cy);
    else ctx.lineTo(cx, cy);
  });
  ctx.stroke();
  ctx.restore();
};

const drawSnakeBody = (ctx: CanvasRenderingContext2D, snake: Position[]) => {
  if (snake.length === 0) return;

  strokeAlongSnake(ctx, snake, BODY_DARK, CELL_SIZE_PX - 2);
  strokeAlongSnake(ctx, snake, BODY_LIGHT, CELL_SIZE_PX - 10);
  strokeAlongSnake(ctx, snake, BODY_HIGHLIGHT, 2, 0.5);

  ctx.fillStyle = SCALE_DOT;
  snake.slice(1).forEach((seg) => {
    const { cx, cy } = centerOf(seg);
    ctx.beginPath();
    ctx.arc(cx, cy, 1.6, 0, Math.PI * 2);
    ctx.fill();
  });
};

const drawSnakeHead = (
  ctx: CanvasRenderingContext2D,
  head: Position,
  direction: Direction,
  tongueOut: boolean,
) => {
  const { cx, cy } = centerOf(head);
  const angle = directionToAngle(direction);
  const r = CELL_SIZE_PX / 2 - 1;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);

  ctx.shadowColor = 'rgba(61, 220, 132, 0.65)';
  ctx.shadowBlur = 14;

  const grad = ctx.createRadialGradient(0, -r * 0.3, r * 0.2, 0, 0, r);
  grad.addColorStop(0, BODY_HIGHLIGHT);
  grad.addColorStop(0.5, BODY_LIGHT);
  grad.addColorStop(1, BODY_DARK);
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.ellipse(0, 0, r + 1, r, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowBlur = 0;

  if (tongueOut) {
    ctx.strokeStyle = '#ff3b6b';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(r * 0.7, 0);
    ctx.lineTo(r * 1.5, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(r * 1.5, 0);
    ctx.lineTo(r * 1.9, -2.5);
    ctx.moveTo(r * 1.5, 0);
    ctx.lineTo(r * 1.9, 2.5);
    ctx.stroke();
  }

  const eyeOffsetX = r * 0.35;
  const eyeOffsetY = r * 0.45;
  const eyeR = 3.2;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(eyeOffsetX, -eyeOffsetY, eyeR, 0, Math.PI * 2);
  ctx.arc(eyeOffsetX, eyeOffsetY, eyeR, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#0a0a0f';
  ctx.beginPath();
  ctx.arc(eyeOffsetX + 1.2, -eyeOffsetY, 1.6, 0, Math.PI * 2);
  ctx.arc(eyeOffsetX + 1.2, eyeOffsetY, 1.6, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
};

const drawMouse = (ctx: CanvasRenderingContext2D, food: Position, pulse: number) => {
  const { cx, cy } = centerOf(food);
  const scale = 1 + Math.sin(pulse / 8) * 0.06;
  const r = (CELL_SIZE_PX / 2 - 2) * scale;

  ctx.save();
  ctx.translate(cx, cy);

  // Tail (curved behind).
  ctx.strokeStyle = MOUSE_BODY_DARK;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(-r * 0.6, r * 0.1);
  ctx.quadraticCurveTo(-r * 1.4, r * 0.6, -r * 1.6, -r * 0.1);
  ctx.stroke();

  // Body (oval) with subtle pink glow.
  ctx.shadowColor = 'rgba(236, 72, 153, 0.5)';
  ctx.shadowBlur = 10;
  const bodyGrad = ctx.createRadialGradient(-r * 0.2, -r * 0.3, r * 0.2, 0, 0, r);
  bodyGrad.addColorStop(0, '#e5e7eb');
  bodyGrad.addColorStop(1, MOUSE_BODY);
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 0.95, r * 0.75, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowBlur = 0;

  // Head.
  ctx.fillStyle = MOUSE_BODY;
  ctx.beginPath();
  ctx.arc(r * 0.55, 0, r * 0.5, 0, Math.PI * 2);
  ctx.fill();

  // Ears.
  const earR = r * 0.28;
  ctx.fillStyle = MOUSE_BODY_DARK;
  ctx.beginPath();
  ctx.arc(r * 0.35, -r * 0.45, earR, 0, Math.PI * 2);
  ctx.arc(r * 0.75, -r * 0.45, earR, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = MOUSE_EAR_INNER;
  ctx.beginPath();
  ctx.arc(r * 0.35, -r * 0.4, earR * 0.55, 0, Math.PI * 2);
  ctx.arc(r * 0.75, -r * 0.4, earR * 0.55, 0, Math.PI * 2);
  ctx.fill();

  // Eyes.
  ctx.fillStyle = MOUSE_EYE;
  ctx.beginPath();
  ctx.arc(r * 0.4, -r * 0.05, 1.6, 0, Math.PI * 2);
  ctx.arc(r * 0.7, -r * 0.05, 1.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(r * 0.42, -r * 0.12, 0.6, 0, Math.PI * 2);
  ctx.arc(r * 0.72, -r * 0.12, 0.6, 0, Math.PI * 2);
  ctx.fill();

  // Nose.
  ctx.fillStyle = MOUSE_NOSE;
  ctx.beginPath();
  ctx.arc(r * 0.95, r * 0.1, 1.8, 0, Math.PI * 2);
  ctx.fill();

  // Whiskers.
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
  ctx.lineWidth = 0.6;
  ctx.beginPath();
  ctx.moveTo(r * 0.85, r * 0.15);
  ctx.lineTo(r * 1.4, r * 0.05);
  ctx.moveTo(r * 0.85, r * 0.2);
  ctx.lineTo(r * 1.4, r * 0.3);
  ctx.stroke();

  ctx.restore();
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

    drawBackground(ctx, W, H);

    pulseRef.current = (pulseRef.current + 1) % 1000;

    drawMouse(ctx, state.food, pulseRef.current);

    drawSnakeBody(ctx, state.snake);
    if (state.snake.length > 0) {
      const tongueOut = Math.floor(pulseRef.current / 6) % 4 === 0;
      drawSnakeHead(ctx, state.snake[0], state.direction, tongueOut);
    }

    if (state.status === 'paused') {
      ctx.fillStyle = 'rgba(8, 12, 30, 0.65)';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = BODY_HIGHLIGHT;
      ctx.font = 'bold 36px ui-sans-serif, system-ui, sans-serif';
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
      className="rounded-2xl border border-white/10 shadow-[0_20px_60px_-10px_rgba(61,220,132,0.45)]"
      role="img"
      aria-label={`Snake board, score ${state.score}`}
    />
  );
};
