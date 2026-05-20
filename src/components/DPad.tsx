import type { Direction } from '../types/game';

interface DPadProps {
  onPress: (direction: Direction) => void;
}

const baseBtn =
  'flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-2xl text-emerald-200 backdrop-blur-md transition active:scale-95 active:bg-emerald-300/25 select-none touch-manipulation';

export const DPad = ({ onPress }: DPadProps) => {
  const handle = (d: Direction) => (e: React.PointerEvent) => {
    e.preventDefault();
    onPress(d);
  };

  return (
    <div
      className="grid grid-cols-3 grid-rows-3 gap-2 md:hidden"
      aria-label="On-screen direction controls"
    >
      <div />
      <button
        type="button"
        onPointerDown={handle('UP')}
        className={baseBtn}
        aria-label="Move up"
      >
        ↑
      </button>
      <div />
      <button
        type="button"
        onPointerDown={handle('LEFT')}
        className={baseBtn}
        aria-label="Move left"
      >
        ←
      </button>
      <div />
      <button
        type="button"
        onPointerDown={handle('RIGHT')}
        className={baseBtn}
        aria-label="Move right"
      >
        →
      </button>
      <div />
      <button
        type="button"
        onPointerDown={handle('DOWN')}
        className={baseBtn}
        aria-label="Move down"
      >
        ↓
      </button>
      <div />
    </div>
  );
};
