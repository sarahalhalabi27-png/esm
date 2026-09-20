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
        // Shared page container. 1388 = 1340 content + 2×24 (the px-6 the
        // sections use); centered in the 1440 frame this yields a uniform
        // 50px page gutter on both sides. Override per section with w-[…] if needed.
        content: "1388px",
      },
      spacing: {
        page: "1.5rem", 
        section: "4rem", 
      },
    },
  },
  plugins: [],
};