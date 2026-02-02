/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "xmas-red": "#D42426",
        "xmas-green": "#0B6623",
        "xmas-gold": "#F8B229",
      },
      fontFamily: {
        christmas: ['"Mountains of Christmas"', "cursive"],
        snowflake: ['"Snowburst One"', '"Mountains of Christmas"', "cursive"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
