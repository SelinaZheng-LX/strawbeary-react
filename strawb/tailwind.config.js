/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        bg: '#fff4f7',
        'text-base': '#0d0d0b',
        primary: '#fec3df',
        secondary: '#f8d1e2',
        tertiary: '#fef1f7',
        accent: '#fe3c69',
      },
      fontFamily: {
        primary: ['"Open Sans"', 'sans-serif'],
        secondary: ['"Noto Serif Hebrew"', 'serif'],
        cursive: ['"League Script"', 'cursive'],
        'cursive-alt': ['"Puppies Play"', 'cursive'],
      },
      backgroundImage: {
        'pink-stripes':
          'repeating-linear-gradient(90deg, #f8d1e2 0, #f8d1e2 2.8rem, #fec3df 2rem, #fec3df 7rem)',
      },
      keyframes: {
        patternShift: {
          from: { backgroundPositionX: '0' },
          to: { backgroundPositionX: '7rem' },
        },
      },
      animation: {
        pattern: 'patternShift 10s linear infinite',
      },
      boxShadow: {
        card: '0 2px 8px rgba(0, 0, 0, 0.1)',
        button: '0 4px 6px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
};

