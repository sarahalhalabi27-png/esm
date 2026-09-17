/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        teal: {
          accent: "#24B9A5",
        },
      },
      fontFamily: {
        display: ["Montserrat Alternates", "sans-serif"],
      },
      maxWidth: {
        content: "72rem",
      },
      spacing: {
        page: "1.5rem", 
        section: "4rem", 
      },
    },
  },
  plugins: [],
};