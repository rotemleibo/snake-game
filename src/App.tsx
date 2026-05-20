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
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-5 overflow-hidden p-4">
      {/* Ambient background orbs */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/10 blur-3xl" />

      <div className="relative z-10 flex flex-col items-center gap-5">
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
              <div className="flex flex-col items-center gap-4 rounded-3xl border border-white/15 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl">
                <h2 className="bg-gradient-to-r from-emerald-300 to-lime-200 bg-clip-text text-3xl font-extrabold tracking-widest text-transparent">
                  PAUSED
                </h2>
                <p className="font-mono text-sm text-slate-400">Score: {state.score}</p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={resume}
                    className="rounded-full border border-emerald-300/50 bg-emerald-300/15 px-5 py-2 text-sm font-semibold text-emerald-200 transition hover:-translate-y-0.5 hover:bg-emerald-300/25 hover:shadow-[0_8px_30px_-5px_rgba(61,220,132,0.5)] focus:outline-none focus:ring-2 focus:ring-emerald-300"
                  >
                    Continue
                  </button>
                  <button
                    type="button"
                    onClick={restart}
                    className="rounded-full border border-slate-400/30 bg-white/5 px-5 py-2 text-sm font-semibold text-slate-200 transition hover:-translate-y-0.5 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  >
                    New Game
                  </button>
                </div>
                <p className="text-xs text-slate-500">Press Space to resume</p>
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

        <p className="font-mono text-xs text-slate-500">
          ↑ ↓ ← → / WASD to move • Space to pause
        </p>
      </div>
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
