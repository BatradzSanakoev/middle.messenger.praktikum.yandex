import { defineConfig } from "vite";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  server: {
    open: true,
    port: Number(process.env.PORT) || 3000,
  },
  preview: {
    open: true,
    port: Number(process.env.PORT) || 3000,
  },
});
