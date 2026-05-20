import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GameOverScreen } from './GameOverScreen';

describe('GameOverScreen', () => {
  it('shows the final score and best score', () => {
    render(
      <GameOverScreen score={12} highScore={42} isNewHighScore={false} onRestart={() => {}} />,
    );
    expect(screen.getByText(/game over/i)).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText(/best: 42/i)).toBeInTheDocument();
  });

  it('shows new-best badge when isNewHighScore', () => {
    render(
      <GameOverScreen score={50} highScore={50} isNewHighScore={true} onRestart={() => {}} />,
    );
    expect(screen.getByText(/new best/i)).toBeInTheDocument();
  });

  it('calls onRestart when Play Again clicked', async () => {
    const user = userEvent.setup();
    const onRestart = vi.fn();
    render(
      <GameOverScreen score={0} highScore={0} isNewHighScore={false} onRestart={onRestart} />,
    );
    await user.click(screen.getByRole('button', { name: /play again/i }));
    expect(onRestart).toHaveBeenCalledTimes(1);
  });
});
