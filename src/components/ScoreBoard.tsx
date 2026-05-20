interface ScoreBoardProps {
  score: number;
  highScore: number;
}

export const ScoreBoard = ({ score, highScore }: ScoreBoardProps) => {
  return (
    <div className="flex w-full max-w-md items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-mono shadow-lg backdrop-blur-md">
      <div className="flex items-center gap-3">
        <span className="text-2xl" aria-hidden="true">
          ⚡
        </span>
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
            Score
          </div>
          <div
            data-testid="score-value"
            aria-live="polite"
            aria-label={`Current score ${score}`}
            className="bg-gradient-to-r from-emerald-300 to-lime-200 bg-clip-text text-3xl font-extrabold text-transparent"
          >
            {score}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
            Best
          </div>
          <div
            data-testid="high-score-value"
            className="bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-3xl font-extrabold text-transparent"
          >
            {highScore}
          </div>
        </div>
        <span className="text-2xl" aria-hidden="true">
          🏆
        </span>
      </div>
    </div>
  );
};
