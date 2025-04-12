/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wine: {
          50: '#fdf8f8',
          100: '#f7e7ea',
          200: '#efd0d6',
          300: '#e2adb7',
          400: '#d48292',
          500: '#c95d70',
          600: '#b84457',
          700: '#9c3345',
          800: '#7a2937',
          900: '#611f2b',
          950: '#3d1019',
        },
        gold: {
          50: '#fbf8ea',
          100: '#f5edc6',
          200: '#ebd98d',
          300: '#e2c257',
          400: '#d9ab31',
          500: '#ca8f20',
          600: '#b37018',
          700: '#945318',
          800: '#7a4119',
          900: '#663617',
          950: '#3d1d0c',
        },
      },
      fontFamily: {
        'cormorant': ['"Cormorant Garamond"', 'serif'],
        'outfit': ['Outfit', 'sans-serif'],
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}