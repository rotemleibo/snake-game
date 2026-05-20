import type { Difficulty } from '../types/game';

interface StartScreenProps {
  onStart: (difficulty: Difficulty) => void;
  highScore: number;
}

const DIFFICULTIES: { value: Difficulty; label: string; subtitle: string }[] = [
  { value: 'slow', label: 'Slow', subtitle: 'Relaxed' },
  { value: 'medium', label: 'Medium', subtitle: 'Classic' },
  { value: 'fast', label: 'Fast', subtitle: 'Hardcore' },
];

export const StartScreen = ({ onStart, highScore }: StartScreenProps) => {
  return (
    <div className="flex flex-col items-center gap-6 rounded-lg border border-board-grid bg-black/50 p-8 backdrop-blur">
      <h1 className="text-5xl font-extrabold tracking-widest text-neon-green drop-shadow-neon">
        SNAKE
      </h1>
      <p className="text-sm text-gray-400">Best score: {highScore}</p>
      <div className="flex gap-3">
        {DIFFICULTIES.map((d) => (
          <button
            key={d.value}
            type="button"
            onClick={() => onStart(d.value)}
            className="group flex flex-col items-center rounded-md border border-neon-green/40 bg-neon-green/5 px-5 py-3 transition hover:bg-neon-green/20 hover:shadow-neon focus:outline-none focus:ring-2 focus:ring-neon-green"
          >
            <span className="text-lg font-semibold text-neon-green">{d.label}</span>
            <span className="text-xs text-gray-400 group-hover:text-gray-200">
              {d.subtitle}
            </span>
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-gray-500">
        Arrow keys / WASD to move • Space to pause
      </p>
    </div>
  );
};
