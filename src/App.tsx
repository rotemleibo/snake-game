import { useGameLoop } from './hooks/useGameLoop';
import { GameCanvas } from './components/GameCanvas';
import { ScoreBoard } from './components/ScoreBoard';
import { StartScreen } from './components/StartScreen';
import { GameOverScreen } from './components/GameOverScreen';
import { ErrorBoundary } from './components/ErrorBoundary';

function GameApp() {
  const { state, start, restart } = useGameLoop();
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
