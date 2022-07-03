/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    fontFamily: {
      'display': ['PT Sans', 'system-ui', 'sans-serif'],
      'body': ['PT Sans', 'system-ui', 'sans-serif'],
      'primary': ['PT Sans', 'Arial', 'sans-serif']
    },
    letterSpacing: {
      wide: '0.18em',
      wider: '0.25em',
      widestest: '0.3em'
    },
    borderWidth: {
      1: '1px'
    },
    maxWidth: {
      "ssm": "50px",
      "msm": "100px",
      "lsm": "150px",
    },
    minWidth: {
      '1': '0.5rem',
      '2': '1rem',
      '4': '2rem',
      '8': '5rem',
    },
    colors: {
      primary: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
      },
      secondary: {
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd5e1',
        400: '#94a3b8',
        500: '#64748b',
        600: '#475569',
        700: '#334155',
        800: '#1e293b',
        900: '#0f172a',
      },
      sky: {
        50: '#BFD7ED',
        100: '#60A3D9',
        150: '#0074B7',
        200: '#003B73',
        300: '#50006C',
      }
    },
  },
  plugins: [],
}