import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.tsx"), // Entry point
      name: "ReviewRequestWorkflow",
      fileName: (format) => `review-request-workflow.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom"], // Mark React as external to avoid bundling it
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});
