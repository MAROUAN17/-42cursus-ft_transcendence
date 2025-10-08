const { transform } = require("typescript");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        float: {
          "0%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(20px)" },
          "100%": { transform: "translateY(0px)" },
        },
      },
      animation: {
        float: "float 3s ease-in-out infinite",
      },
      colors: {
        gameBg: "#090040",
        neon: "#B13BFF",
        bat2Color: "#FFCC00",
        darkBg: "#14121C",
        darkBg: "#090040",
        compBg: "#471396", 
        borderColor: "#312F62",
      },
      fontFamily: {
        poppins: ["poppins", "sans-serif"],
        bebas: ['"Bebas Neue"', "sans-serif"],
      },
      screens: {
        lg: "1200px",
        xl: "2000px",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
