
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gameBg' : '#090040',
        'neon' : '#B13BFF',
        'bat2Color': '#FFCC00',
        'darkBg' : '#14121C',
        'compBg' : '#471396'
      },
      fontFamily: {
        'poppins': ['poppins', 'sans-serif']
      },
      screens: {
        'lg': '1200px',
        'xl': '2000px'
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}