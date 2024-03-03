/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './index.html'],
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
        200: '50rem',
        248: '62rem', // screen-lg, minus 1rem each side for padding
      },
      gridTemplateColumns: {
        'runs-page': 'repeat(8, minmax(auto, max-content))',
        'plans-page': 'repeat(7, minmax(auto, max-content))',
        'shoe-list': 'repeat(4, minmax(auto, max-content))',
      },
      colors: {
        eggplant: {
          700: '#7A2A46', // active bg, focus outline
          600: '#983457', // active bg + :hover state
          300: '#A1687C', // :disabled state
        },

        // Category colors
        // Cool
        rest: {
          800: '#262626', // neutral-800
          700: '#333333',
        },
        'cross-training': {
          700: '#1782a2', // light blue
          600: '#157794', // light blue
        },
        recovery: {
          700: '#2d6d92', // blue
          600: '#296485', // blue
        },
        easy: {
          700: '#455d88', // deep blue
          600: '#3f557c', // deep blue
        },
        long: {
          700: '#5b4c7c', // purple
          600: '#544672', // purple
        },

        // Warm
        marathon: {
          700: '#733d71', // eggplant
          600: '#693767', // eggplant
        },
        tempo: {
          700: '#892b64', // fuschia
          600: '#7d285b', // fuschia
        },
        vo2max: {
          700: '#9f1a58', // red-purple
          600: '#921851', // red-purple
        },
        race: {
          700: '#b6094b', // bright red
          600: '#a70845', // bright red
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

