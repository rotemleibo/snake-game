import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScoreBoard } from './ScoreBoard';

describe('ScoreBoard', () => {
  it('renders current score and high score', () => {
    render(<ScoreBoard score={7} highScore={42} />);
    expect(screen.getByTestId('score-value')).toHaveTextContent('7');
    expect(screen.getByTestId('high-score-value')).toHaveTextContent('42');
  });

  it('marks the score region as aria-live polite', () => {
    render(<ScoreBoard score={1} highScore={1} />);
    expect(screen.getByTestId('score-value')).toHaveAttribute('aria-live', 'polite');
  });
});
