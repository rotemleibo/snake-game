/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'neon-green': '#39ff14',
        'neon-cyan': '#00ffff',
        'neon-red': '#ff073a',
        'board-bg': '#0a0a0f',
        'board-grid': '#15151f',
      },
      boxShadow: {
        neon: '0 0 12px rgba(57, 255, 20, 0.7)',
      },
    },
  },
  plugins: [],
};
