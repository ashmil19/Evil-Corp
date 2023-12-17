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
        'custom-cyan' : '#04D2C8',
        'profile-card-color': '#4d44b5',
        'dashboard-bg' : '#1F1F1F',
        'teacher-card-bg' : '#272738',
        'teacher-btn' : '#FB7D5B',
        'course-card' : '#c7becc',
        'otp-bg' : '#f2f2f3'
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      height: {
        'course': '130vh',
        'homeBanner': '80vh', 
        'homeBanner-sm': '60vh',
        'screen+50': '150vh'
      },
      fontSize: {
        'verySmall': '0.625rem',
        'verySmall-1': '0.725rem',
        'veryLarge': '2.5rem'
      },
      colors: {
        'profile-color' : '#4d44b5',
        'dashboard' : '#9FEF00',
        'Student-management' : '#111927'
      }
    },
  },
  plugins: [],
})

