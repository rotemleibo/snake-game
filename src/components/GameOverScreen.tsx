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
    <div className="animate-[fadeIn_300ms_ease-out] flex flex-col items-center gap-4 rounded-lg border border-neon-red/40 bg-black/70 p-8 backdrop-blur">
      <h2 className="text-4xl font-extrabold tracking-wider text-neon-red">GAME OVER</h2>
      <div className="text-center font-mono">
        <div className="text-sm text-gray-400">Score</div>
        <div className="text-3xl font-bold text-neon-green">{score}</div>
        {isNewHighScore && (
          <div className="mt-2 text-sm font-semibold text-neon-cyan">★ NEW BEST ★</div>
        )}
        <div className="mt-2 text-xs text-gray-500">Best: {highScore}</div>
      </div>
      <button
        type="button"
        onClick={onRestart}
        autoFocus
        className="rounded-md border border-neon-green bg-neon-green/10 px-6 py-2 font-semibold text-neon-green transition hover:bg-neon-green/25 hover:shadow-neon focus:outline-none focus:ring-2 focus:ring-neon-green"
      >
        Play Again
      </button>
    </div>
  );
};
