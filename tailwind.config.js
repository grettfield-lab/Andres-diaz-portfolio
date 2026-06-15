const { lighten, darken, transparentize } = require('polished')

const ACCENT = '#E84B2A'
const SURFACE = '#111111'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0A0A0A',
        surface: SURFACE,
        'surface-2': '#181818',
        'surface-hover': lighten(0.04, SURFACE),
        primary: '#F0EDE8',
        muted: '#8A8480',
        accent: ACCENT,
        'accent-dim': transparentize(0.8, ACCENT),
        'accent-hover': lighten(0.07, ACCENT),
        'accent-dark': darken(0.08, ACCENT),
      },
      fontFamily: {
        display: ['var(--font-outfit)', 'sans-serif'],
        mono: ['var(--font-space-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
}
