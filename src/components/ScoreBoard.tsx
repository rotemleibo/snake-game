interface ScoreBoardProps {
  score: number;
  highScore: number;
}

export const ScoreBoard = ({ score, highScore }: ScoreBoardProps) => {
  return (
    <div className="flex w-full max-w-md items-center justify-between rounded-md border border-board-grid bg-black/40 px-4 py-2 font-mono">
      <div>
        <div className="text-xs uppercase tracking-widest text-gray-400">Score</div>
        <div
          data-testid="score-value"
          aria-live="polite"
          aria-label={`Current score ${score}`}
          className="text-2xl font-bold text-neon-green"
        >
          {score}
        </div>
      </div>
      <div className="text-right">
        <div className="text-xs uppercase tracking-widest text-gray-400">Best</div>
        <div data-testid="high-score-value" className="text-2xl font-bold text-neon-cyan">
          {highScore}
        </div>
      </div>
    </div>
  );
};
