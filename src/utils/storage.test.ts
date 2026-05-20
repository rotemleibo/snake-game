import { describe, it, expect, beforeEach } from 'vitest';
import { loadHighScore, saveHighScore, HIGH_SCORE_KEY } from './storage';

describe('storage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('returns 0 when no high score saved', () => {
    expect(loadHighScore()).toBe(0);
  });

  it('persists and reads back a high score', () => {
    saveHighScore(42);
    expect(loadHighScore()).toBe(42);
  });

  it('ignores invalid stored values', () => {
    window.localStorage.setItem(HIGH_SCORE_KEY, 'not-a-number');
    expect(loadHighScore()).toBe(0);
  });

  it('clamps negative values when saving', () => {
    saveHighScore(-5);
    expect(loadHighScore()).toBe(0);
  });

  it('floors decimal values', () => {
    saveHighScore(7.9);
    expect(loadHighScore()).toBe(7);
  });
});
