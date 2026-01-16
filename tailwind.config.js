// tailwind.config.ts
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,ts,component.html,component.ts}",
    "./src/**/*.html",
  ],
  safelist: [
    'w-64',
    'w-20',
    'translate-x-0',
    '-translate-x-full',
    'lg:translate-x-0',
    'transform',
    'bg-gradient-to-r',
    'from-indigo-600',
    'to-purple-600',
    'hover:from-indigo-700',
    'hover:to-purple-700',
    'bg-emerald-100',
    'text-emerald-800',
    'bg-rose-100',
    'text-rose-800',
    'bg-indigo-50/30',
    'focus:ring-indigo-500/30',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}