/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // teal-accent is now theme-aware (bright teal in dark, dark teal in light)
        teal: {
          accent: "rgb(var(--accent) / <alpha-value>)",
        },
        page: "rgb(var(--page) / <alpha-value>)",
        fg: "rgb(var(--fg) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
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