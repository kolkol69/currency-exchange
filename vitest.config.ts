import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import svgr from "vite-plugin-svgr"
import path from "path"

export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.ts",
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json-summary"],
      exclude: [
        "src/types.ts",
        "**/*.d.ts",
        "eslint.config.js",
        "vite.config.ts",
        "vitest.config.ts",
      ],
    },
  },
})
