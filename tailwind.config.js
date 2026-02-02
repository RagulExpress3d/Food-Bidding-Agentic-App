/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  safelist: [
    'bg-red-500',
    'bg-red-600',
    'bg-cyan-500',
    'bg-cyan-600',
    'bg-amber-600',
    'bg-amber-700',
    'bg-emerald-500',
    'bg-emerald-600',
    'bg-stone-600',
    'bg-stone-700',
    'bg-rose-500',
    'bg-rose-600',
    'bg-orange-500',
    'bg-orange-600',
    'bg-dd-orange',
    'text-white',
  ],
  theme: {
    extend: {
      colors: {
        dd: {
          orange: '#FF3008',
          dark: '#191919',
          light: '#F7F7F7',
          muted: '#767676',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
