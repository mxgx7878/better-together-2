import { createRequire } from 'module';

const require = createRequire(import.meta.url);

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ndis-green': '#00B894',
        'ndis-red': '#FF6B6B',
        'ndis-yellow': '#FFD93D',
        'ndis-purple': '#6C5CE7',
      },
    },
  },
  plugins: [],
};
