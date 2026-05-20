import { useRef, useState } from 'react';
import type { Direction } from '../types/game';

interface JoystickProps {
  onDirection: (direction: Direction) => void;
}

const BASE_SIZE = 130;
const STICK_SIZE = 56;
const DEAD_ZONE_RATIO = 0.25; // distance from center, as fraction of base radius

const angleToDirection = (dx: number, dy: number): Direction => {
  // Screen Y is inverted (down is positive). Convert to math angle.
  const angle = Math.atan2(-dy, dx); // -π..π, 0 = right, π/2 = up
  const deg = (angle * 180) / Math.PI;
  if (deg >= -45 && deg < 45) return 'RIGHT';
  if (deg >= 45 && deg < 135) return 'UP';
  if (deg >= -135 && deg < -45) return 'DOWN';
  return 'LEFT';
};

export const Joystick = ({ onDirection }: JoystickProps) => {
  const baseRef = useRef<HTMLDivElement | null>(null);
  const pointerIdRef = useRef<number | null>(null);
  const lastDirRef = useRef<Direction | null>(null);
  const [stickPos, setStickPos] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);

  const radius = BASE_SIZE / 2;
  const deadZone = radius * DEAD_ZONE_RATIO;

  const updateFromPointer = (clientX: number, clientY: number) => {
    const base = baseRef.current;
    if (!base) return;
    const rect = base.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    let dx = clientX - cx;
    let dy = clientY - cy;
    const dist = Math.hypot(dx, dy);
    // Clamp stick to base radius.
    if (dist > radius) {
      dx = (dx / dist) * radius;
      dy = (dy / dist) * radius;
    }
    setStickPos({ x: dx, y: dy });

    if (dist >= deadZone) {
      const dir = angleToDirection(dx, dy);
      if (dir !== lastDirRef.current) {
        lastDirRef.current = dir;
        onDirection(dir);
      }
    }
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current !== null) return;
    pointerIdRef.current = e.pointerId;
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    setActive(true);
    updateFromPointer(e.clientX, e.clientY);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerId !== pointerIdRef.current) return;
    updateFromPointer(e.clientX, e.clientY);
  };

  const release = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerId !== pointerIdRef.current) return;
    pointerIdRef.current = null;
    lastDirRef.current = null;
    setActive(false);
    setStickPos({ x: 0, y: 0 });
    try {
      (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  return (
    <div
      ref={baseRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={release}
      onPointerCancel={release}
      role="application"
      aria-label="Virtual joystick"
      className="relative touch-none select-none rounded-full border border-white/15 bg-white/5 shadow-lg backdrop-blur-md md:hidden"
      style={{
        width: BASE_SIZE,
        height: BASE_SIZE,
      }}
    >
      {/* Center dot */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/30"
      />
      {/* Stick */}
      <div
        className={`pointer-events-none absolute left-1/2 top-1/2 rounded-full border border-emerald-200/40 shadow-[0_0_20px_rgba(61,220,132,0.4)] transition-colors ${
          active ? 'bg-emerald-300/40' : 'bg-emerald-300/20'
        }`}
        style={{
          width: STICK_SIZE,
          height: STICK_SIZE,
          transform: `translate(calc(-50% + ${stickPos.x}px), calc(-50% + ${stickPos.y}px))`,
          transition: active ? 'none' : 'transform 150ms ease-out',
        }}
      />
    </div>
  );
};
