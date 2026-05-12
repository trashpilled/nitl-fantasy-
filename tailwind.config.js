/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        nitl: {
          green: '#047a3b',
          'green-dark': '#03612f',
          red: '#c8102e',
          'dem-blue': '#1a4d8a',
          'rep-red': '#c8102e',
          gold: '#f4a300',
          cream: '#f4ecd8',
          black: '#1a1a1a',
          bg: '#fafafa',
          border: '#e5e5e5',
          muted: '#888888',
          body: '#1a1a1a',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        serif: ['Georgia', 'Times New Roman', 'serif'],
      },
      borderWidth: {
        '0.5': '0.5px',
      },
    },
  },
  plugins: [],
}
