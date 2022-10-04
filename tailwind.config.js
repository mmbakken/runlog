module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      heading: ['Train One', 'Quicksand', 'sans-serif'],
      sans: ['Quicksand', 'sans-serif'],
      mono: [
        'source-code-pro',
        'Menlo',
        'Monaco',
        'Consolas',
        'Courier New',
        'monospace',
      ],
    },
    extend: {
      spacing: {
        // 1rem === 4 units
        120: '30rem',
        160: '40rem',
      },
      gridTemplateColumns: {
        'daily-stats-page': 'repeat(5, minmax(auto, max-content))',
        'runs-page': 'repeat(7, minmax(auto, max-content))',
      },
      colors: {
        eggplant: {
          700: '#7A2A46', // active bg, focus outline
          600: '#983457', // active bg + :hover state
          300: '#A1687C', // :disabled state
        },
        offwhite: {
          25: '#FBF7F6',
          50: '#faf6f4',
          100: '#F6EEE9',
          200: '#E9DFD8',
        },
      },
    },
  },
  variants: {
    extend: {
      padding: ['last'],
    },
  },
  plugins: [],
}
