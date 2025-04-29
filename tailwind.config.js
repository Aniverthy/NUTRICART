/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors:{
        primary:"#000000",
        secondary: {
          DEFAULT: "#00FF00",
          100: "#00E500",
          200: "#00CC00",
        },
      }
    },
  },
  plugins: [],
}

