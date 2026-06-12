/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0F172A',
          card: '#1E293B',
          border: '#334155',
          text: '#F8FAFC',
          muted: '#94A3B8'
        },
        accent: {
          primary: '#6366F1',
          secondary: '#EC4899',
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444'
        },
        // Flat keys prevent overriding the default Tailwind color palettes
        'slate-105': '#f1f5f9',
        'slate-150': '#eaedf2',
        'slate-250': '#d8e2ef',
        'slate-550': '#55647a',
        'slate-650': '#3d4b5f',
        'slate-750': '#293548',
        'slate-805': '#1e293b',
        'slate-850': '#172033',
        'indigo-150': '#d9e2fc',
        'indigo-550': '#5a55e9',
        'indigo-650': '#493ecd',
        'pink-650': '#cd206a',
        'purple-650': '#8829dd',
        'red-150': '#fed5d5',
        'red-155': '#fec4c4',
        'red-550': '#e53333',
        'red-650': '#c92020',
        'red-655': '#aa1d1d',
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      }
    },
  },
  plugins: [],
}
