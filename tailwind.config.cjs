/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    // https://daisyui.com/docs/themes/#-1
    // "light" is default for light mode
    // "dracula" is default for dark mode
    themes: ["light", "dracula"],
  },
};
