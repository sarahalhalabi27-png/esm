import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Long-lived vendor chunks: they change far less often than app code,
        // so browsers keep them cached across deploys.
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          state: ["@reduxjs/toolkit", "react-redux", "redux-persist"],
          motion: ["gsap"],
          i18n: ["i18next", "react-i18next"],
        },
      },
    },
  },
});
