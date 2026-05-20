import type { Difficulty } from '../types/game';

interface StartScreenProps {
  onStart: (difficulty: Difficulty) => void;
  highScore: number;
}

const DIFFICULTIES: { value: Difficulty; label: string; subtitle: string; emoji: string }[] = [
  { value: 'slow', label: 'Slow', subtitle: 'Relaxed', emoji: '🐢' },
  { value: 'medium', label: 'Medium', subtitle: 'Classic', emoji: '🐍' },
  { value: 'fast', label: 'Fast', subtitle: 'Hardcore', emoji: '🔥' },
];

export const StartScreen = ({ onStart, highScore }: StartScreenProps) => {
  return (
    <div className="flex flex-col items-center gap-6 rounded-3xl border border-white/15 bg-slate-900/70 p-10 shadow-2xl backdrop-blur-xl">
      <div className="flex flex-col items-center gap-2">
        <span className="text-5xl" aria-hidden="true">🐍</span>
        <h1 className="bg-gradient-to-br from-emerald-300 via-lime-200 to-teal-200 bg-clip-text text-6xl font-black tracking-widest text-transparent drop-shadow-[0_0_25px_rgba(61,220,132,0.45)]">
          SNAKE
        </h1>
        <p className="text-sm text-slate-400">Eat mice. Don't bite yourself.</p>
      </div>
      <div className="rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-1 text-xs font-mono text-amber-200">
        🏆 Best: {highScore}
      </div>
      <div className="flex gap-3">
        {DIFFICULTIES.map((d) => (
          <button
            key={d.value}
            type="button"
            onClick={() => onStart(d.value)}
            className="group flex w-24 flex-col items-center gap-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-300/60 hover:bg-emerald-300/10 hover:shadow-[0_8px_30px_-5px_rgba(61,220,132,0.5)] focus:outline-none focus:ring-2 focus:ring-emerald-300"
          >
            <span className="text-2xl transition-transform group-hover:scale-110" aria-hidden="true">
              {d.emoji}
            </span>
            <span className="text-sm font-bold text-emerald-200">{d.label}</span>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 group-hover:text-slate-200">
              {d.subtitle}
            </span>
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-slate-500">
        Arrow keys / WASD • Space to pause
      </p>
    </div>
  );
};
