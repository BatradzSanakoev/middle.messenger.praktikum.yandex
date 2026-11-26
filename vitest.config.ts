import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    include: ["**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
      "@shared": path.resolve(import.meta.dirname, "./src/shared"),
      "@pages": path.resolve(import.meta.dirname, "./src/pages"),
      "@features": path.resolve(import.meta.dirname, "./src/features"),
      "@helpers": path.resolve(import.meta.dirname, "./src/helpers"),
      "@styles": path.resolve(import.meta.dirname, "./src/styles"),
      "@init": path.resolve(import.meta.dirname, "./src/init"),
    },
  },
  assetsInclude: ["**/*.hbs"],
});
