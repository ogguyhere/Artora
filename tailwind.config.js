/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        orchid: "#da70d6",
        dustyrose: "#d08787",
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
