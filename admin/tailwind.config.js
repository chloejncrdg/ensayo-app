/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-darkBlue': '#003c6e', // Define your custom blue color here
        'custom-blue': '#006fcc', // Define your custom blue color here
        'light-blue': '#E1F2F8',
      },
      fontFamily: {
        'sf-black': ['SFBlack', 'sans-serif'],
        'sf-bold': ['SFBold', 'sans-serif'],
        'sf-regular': ['SFRegular', 'sans-serif'],
        'sf-light': ['SFLight', 'sans-serif']
      },
      boxShadow: {
        'custom-dark': '0 5px 10px rgba(0, 0, 0, 0.2)', // Example custom shadow
      }
    },
  },
  plugins: [],
}
