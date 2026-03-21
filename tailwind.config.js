/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,html}'],
  theme: {
    extend: {
      colors: {
        linkedin: {
          50: '#e8f4fd',
          100: '#cce5f7',
          200: '#99ccef',
          300: '#66b2e7',
          400: '#3399df',
          500: '#0a66c2',
          600: '#004182',
          700: '#003366',
          800: '#00264d',
          900: '#001a33',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
