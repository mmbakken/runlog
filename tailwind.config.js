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
          600: '#F6EEE9',
          700: '#E9DFD8',
        },
        long: {
          600: '#C8DFEE',
          700: '#b1d1e7',
        },
        easy: {
          600: '#D1DECE',
          700: '#B9D6B0',
        },
        tempo: {
          600: '#F5E9C6',
          700: '#f8e5af',
        },
        intervals: {
          600: '#F5D1C2',
          700: '#f1bda7',
        },
        repetitions: {
          600: '#EEB6B6',
          700: '#e89d9d',
        },
        marathon: {
          600: '#F5E9C6',
          700: '#f8e5af',
        },
        race: {
          600: '#E89B9B',
          700: '#e38585',
        },
        'trail-run': {
          600: '#F5E9C6',
          700: '#f8e5af',
        },
        hiking: {
          600: '#D1DECE',
          700: '#B9D6B0',
        },
        spinning: {
          600: '#D8C8E4',
          700: '#D0BAE1',
        },
        'downhill-skiing': {
          600: '#D8C8E4',
          700: '#D0BAE1',
        },
        'backcountry-skiing': {
          600: '#D8C8E4',
          700: '#D0BAE1',
        },
        lifting: {
          600: '#D8C8E4',
          700: '#D0BAE1',
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
