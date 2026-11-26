import dotenv from "dotenv";
import path from "path";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";

dotenv.config();

export default defineConfig({
  plugins: [
    checker({
      typescript: {
        tsconfigPath: "./tsconfig.json",
        buildMode: true, // только проверка типов, не компиляция
      },
      eslint: {
        lintCommand: "eslint .", // команда для ESLint
      },
      stylelint: {
        lintCommand: 'stylelint "src/**/*.css"', // команда для Stylelint
      },
    }),
  ],
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
  server: {
    open: true,
    port: Number(process.env.PORT) || 3000,
  },
});
