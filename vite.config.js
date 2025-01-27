import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import git from "git-rev-sync";

process.env.VITE_GIT_COMMIT_HASH = git.short();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: "",
  publicPath: process.env.NODE_ENV === "production" ? "/ib/" : "/",
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
