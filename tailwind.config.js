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
        'bat2Color': '#FFCC00'
      },
    },
  },
  plugins: [],
}