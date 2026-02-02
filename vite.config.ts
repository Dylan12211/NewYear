import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  base: "/NewYear/",

  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  optimizeDeps: {
    exclude: ["@mediapipe/hands", "@mediapipe/camera_utils"], // 🚫 không pre-bundle
  },

  build: {
    outDir: "dist",
    assetsDir: "assets",
    rollupOptions: {
      external: ["@mediapipe/hands", "@mediapipe/camera_utils"], // 🚫 không bundle
    },
  },
});
