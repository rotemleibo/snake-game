import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App integration', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('shows start screen on initial render', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /medium/i })).toBeInTheDocument();
  });

  it('starts the game when difficulty is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /medium/i }));
    // After starting, the start screen difficulty buttons should be gone.
    expect(screen.queryByRole('button', { name: /medium/i })).not.toBeInTheDocument();
    // Canvas should be present with aria-label score 0.
    expect(screen.getByRole('img', { name: /score 0/i })).toBeInTheDocument();
  });
});
