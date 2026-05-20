import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StartScreen } from './StartScreen';

describe('StartScreen', () => {
  it('renders all difficulty options', () => {
    render(<StartScreen onStart={() => {}} highScore={0} />);
    expect(screen.getByRole('button', { name: /slow/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /medium/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /fast/i })).toBeInTheDocument();
  });

  it('calls onStart with selected difficulty', async () => {
    const user = userEvent.setup();
    const onStart = vi.fn();
    render(<StartScreen onStart={onStart} highScore={0} />);
    await user.click(screen.getByRole('button', { name: /fast/i }));
    expect(onStart).toHaveBeenCalledWith('fast');
  });

  it('displays the high score', () => {
    render(<StartScreen onStart={() => {}} highScore={99} />);
    expect(screen.getByText(/best score: 99/i)).toBeInTheDocument();
  });
});
