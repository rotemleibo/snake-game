import { useGameLoop } from './hooks/useGameLoop';
import { GameCanvas } from './components/GameCanvas';
import { ScoreBoard } from './components/ScoreBoard';
import { StartScreen } from './components/StartScreen';
import { GameOverScreen } from './components/GameOverScreen';
import { ErrorBoundary } from './components/ErrorBoundary';

function GameApp() {
  const { state, start, restart, resume } = useGameLoop();
  const isNewHigh = state.score > 0 && state.score >= state.highScore;

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5 p-4">
      <ScoreBoard score={state.score} highScore={state.highScore} />

      <div className="relative">
        <GameCanvas state={state} />

        {state.status === 'idle' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <StartScreen onStart={start} highScore={state.highScore} />
          </div>
        )}

        {state.status === 'paused' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4 rounded-lg border border-board-grid bg-black/70 p-6 backdrop-blur">
              <h2 className="text-3xl font-bold tracking-widest text-neon-green drop-shadow-neon">
                PAUSED
              </h2>
              <p className="text-sm text-gray-400">Score: {state.score}</p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={resume}
                  className="rounded-md border border-neon-green/40 bg-neon-green/10 px-4 py-2 text-sm font-semibold text-neon-green transition hover:bg-neon-green/25 hover:shadow-neon focus:outline-none focus:ring-2 focus:ring-neon-green"
                >
                  Continue
                </button>
                <button
                  type="button"
                  onClick={restart}
                  className="rounded-md border border-gray-500/40 bg-gray-500/10 px-4 py-2 text-sm font-semibold text-gray-200 transition hover:bg-gray-500/25 focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  New Game
                </button>
              </div>
              <p className="text-xs text-gray-500">Press Space to resume</p>
            </div>
          </div>
        )}

        {state.status === 'gameover' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <GameOverScreen
              score={state.score}
              highScore={state.highScore}
              isNewHighScore={isNewHigh}
              onRestart={restart}
            />
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500">
        ↑ ↓ ← → / WASD to move • Space to pause
      </p>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <GameApp />
    </ErrorBoundary>
  );
}

export default App;
