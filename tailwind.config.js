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
        'list-page': 'repeat(9, auto)',
      },
      colors: {
        eggplant: {
          700: '#7A2A46',
          600: '#983457',
        },
        offwhite: {
          25: '#FBF7F6',
          50: '#faf6f4',
          100: '#F6EEE9',
        },
      },
    },
  },
  variants: {
    extend: {
      padding: ['first'],
    },
  },
  plugins: [],
}
