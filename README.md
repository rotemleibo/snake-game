# 🐍 Snake Game

A modern, polished browser implementation of the classic Snake game — built with React, TypeScript, Vite, and HTML5 Canvas. Features a neon dark theme, smooth 60fps gameplay, three difficulty levels, persistent high scores, and a fully tested pure-function game core.

---

## ✨ Features

- 🎨 **Neon dark theme** with glowing snake head and pulsing food
- ⚡ **60fps Canvas rendering** via `requestAnimationFrame`
- 🎮 **Three difficulty levels** — Slow (150ms), Medium (100ms), Fast (60ms)
- 📈 **Progressive speed-up** — gets faster every 5 points
- 🏆 **Persistent high score** via safe `localStorage` wrapper (with in-memory fallback)
- ⌨️ **Keyboard controls** — Arrow keys or WASD; Space to pause
- ♿ **Accessibility** — `aria-live` score updates, labeled canvas
- 🛡️ **Error boundary** — graceful crash recovery
- ✅ **61 unit + integration tests** with Vitest

---

## 🎯 Controls

| Key | Action |
|---|---|
| `↑` `↓` `←` `→` | Move snake |
| `W` `A` `S` `D` | Move snake (alternative) |
| `Space` | Pause / Resume |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Install & Run

```bash
npm install
npm run dev
```

Open <http://localhost:5173> in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🧪 Testing

```bash
npm run test            # run all tests once
npm run test:watch      # watch mode
npm run test:coverage   # coverage report
```

**Test stats:** 61 tests across 8 files — game logic, reducer, storage, and UI components.

---

## 📁 Project Structure

```
src/
├── components/
│   ├── GameCanvas.tsx        # Canvas renderer (snake, food, grid)
│   ├── ScoreBoard.tsx        # Live score + high score display
│   ├── StartScreen.tsx       # Difficulty picker
│   ├── GameOverScreen.tsx    # End-of-game overlay
│   └── ErrorBoundary.tsx     # Crash safety net
├── game/
│   ├── gameReducer.ts        # Pure state machine — all game logic
│   ├── gameReducer.test.ts
│   ├── gameUtils.ts          # Collision, food generation, helpers
│   └── gameUtils.test.ts
├── hooks/
│   └── useGameLoop.ts        # rAF loop, keyboard, state wrapper
├── types/
│   └── game.ts               # All shared types + constants
├── utils/
│   ├── storage.ts            # Safe localStorage wrapper
│   └── storage.test.ts
├── App.tsx                   # Composition root
└── main.tsx                  # Entry point
```

---

## 🏗️ Architecture

### Pure Reducer Pattern

All game logic lives in a **pure `gameReducer`** function that takes `(state, action)` and returns the next state. This means:

- ✅ Trivially testable with unit tests (no React, no DOM, no timers)
- ✅ Predictable — same input always produces same output
- ✅ Easy to reason about — all transitions are explicit

The reducer handles seven actions: `START`, `TICK`, `CHANGE_DIRECTION`, `PAUSE`, `RESUME`, `RESTART`, `SET_HIGH_SCORE`.

### Render Separation

- **`GameCanvas`** only draws — it never owns state.
- **`useGameLoop`** owns the `requestAnimationFrame` loop, keyboard listener, and `localStorage` persistence — but delegates all decisions to the reducer.
- **UI components** (`ScoreBoard`, `StartScreen`, `GameOverScreen`) are pure presentation.

### Direction Queue (Anti-Reversal)

A common Snake bug: pressing `→` then `↓` then `←` rapidly causes the snake to instantly reverse and collide with itself. We prevent this by:

1. Storing changes in `pendingDirection`
2. Validating the new direction against the **committed** `direction` (not the pending one)
3. Rejecting 180° reversals before they're committed

### Storage Safety

`localStorage` throws in private browsing on some browsers. The `storage.ts` wrapper:

1. Probes `localStorage` on module load
2. Falls back to an in-memory `Map` if unavailable
3. Wraps every read/write in `try/catch`

---

## 🎨 Tech Stack

| Layer | Tech |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 8 |
| Styling | Tailwind CSS 3 |
| Rendering | HTML5 Canvas 2D API |
| State | `useReducer` + pure `gameReducer` |
| Tests | Vitest 4 + React Testing Library + jsdom |
| Quality | ESLint + Prettier |

---

## 📜 License

MIT
