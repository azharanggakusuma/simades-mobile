/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./App.{js,ts,tsx}",
    "./components/**/*.{js,ts,tsx}",
    "./screens/**/*.{js,ts,jsx,tsx}",
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {},
  },
  plugins: [],
};
