import { defineConfig } from "vite";

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? "/church-cal/" : "./",
  build: {
    sourcemap: true,
  },
});
