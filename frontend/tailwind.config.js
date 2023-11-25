/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

export default withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        'custom-bg-color': '#111927',
        'custom-btnColor': '#9FEF00',
        'custom-cyan' : '#04D2C8'
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      height: {
        'homeBanner': '80vh', 
        'homeBanner-sm': '60vh' 
      },
      fontSize: {
        'verySmall': '0.625rem'
      }
    },
  },
  plugins: [],
})

