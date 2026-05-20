interface GameOverScreenProps {
  score: number;
  highScore: number;
  isNewHighScore: boolean;
  onRestart: () => void;
}

export const GameOverScreen = ({
  score,
  highScore,
  isNewHighScore,
  onRestart,
}: GameOverScreenProps) => {
  return (
    <div className="flex animate-[fadeIn_300ms_ease-out] flex-col items-center gap-5 rounded-3xl border border-rose-400/30 bg-slate-900/80 p-10 shadow-[0_20px_60px_-10px_rgba(244,63,94,0.45)] backdrop-blur-xl">
      <span className="text-5xl" aria-hidden="true">💀</span>
      <h2 className="bg-gradient-to-r from-rose-400 to-pink-300 bg-clip-text text-4xl font-black tracking-wider text-transparent">
        GAME OVER
      </h2>
      <div className="text-center font-mono">
        <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Score</div>
        <div className="bg-gradient-to-r from-emerald-300 to-lime-200 bg-clip-text text-5xl font-extrabold text-transparent">
          {score}
        </div>
        {isNewHighScore && (
          <div className="mt-3 animate-pulse rounded-full bg-amber-300/15 px-3 py-1 text-sm font-semibold text-amber-200">
            ★ NEW BEST ★
          </div>
        )}
        <div className="mt-3 text-xs text-slate-500">Previous best: {highScore}</div>
      </div>
      <button
        type="button"
        onClick={onRestart}
        autoFocus
        className="rounded-full border border-emerald-300/50 bg-emerald-300/15 px-8 py-2.5 font-semibold text-emerald-200 transition-all hover:-translate-y-0.5 hover:bg-emerald-300/25 hover:shadow-[0_8px_30px_-5px_rgba(61,220,132,0.6)] focus:outline-none focus:ring-2 focus:ring-emerald-300"
      >
        Play Again
      </button>
    </div>
  );
};
