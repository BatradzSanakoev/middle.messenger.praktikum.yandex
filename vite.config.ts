import { defineConfig } from "vite";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

export default defineConfig({
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
  server: {
    open: true,
    port: Number(process.env.PORT) || 3000,
  },
});
