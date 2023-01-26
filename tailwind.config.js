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
      transitionProperty: {
        outline: 'outline-width, border-right',
        border: 'border-width',
      },
      width: {
        18: '4.5rem',
      },
      borderWidth: {
        3: '3px',
      },
      outlineWidth: {
        3: '3px',
      },
      spacing: {
        // 1rem === 4 units
        120: '30rem',
        160: '40rem',
        248: '62rem', // screen-lg, minus 1rem each side for padding
      },
      gridTemplateColumns: {
        'runs-page': 'repeat(8, minmax(auto, max-content))',
        'plans-page': 'repeat(8, minmax(auto, max-content))',
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

        // Category colors
        rest: {
          600: '#F6EEE9', // offwhite
          700: '#E9DFD8',
        },
        recovery: {
          600: '#DECAEC', // purple
          700: '#D6C0E6',
        },
        easy: {
          600: '#C8DFEE', // blue
          700: '#b1d1e7',
        },
        long: {
          600: '#D1DECE', // green
          700: '#B9D6B0',
        },
        marathon: {
          600: '#F5E9C6', // yellow
          700: '#f8e5af',
        },
        tempo: {
          600: '#F5D1C2', // orange
          700: '#f1bda7',
        },
        vo2max: {
          600: '#EEB6B6', // red
          700: '#e89d9d',
        },
        race: {
          600: '#E89B9B', // dark red
          700: '#e38585',
        },
        'cross-training': {
          600: '#F8D6ED', // pink
          700: '#F6CBE8',
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
