import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  base: "//NewYear/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    rollupOptions: {
      output: {
        manualChunks: {
          three: ["three"],
          mediapipe: ["@mediapipe/hands", "@mediapipe/camera_utils"],
        },
      },
    },
  },
  optimizeDeps: {
    include: ["three", "@mediapipe/hands", "@mediapipe/camera_utils"],
  },
});
