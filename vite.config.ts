import { defineConfig } from "vite";
import dotenv from "dotenv";

dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    open: true,
    port: Number(process.env.PORT) || 3000,
  },
});
