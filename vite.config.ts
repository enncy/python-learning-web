import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import jsx from "@vitejs/plugin-vue-jsx";
import path from "path";
import Components from "unplugin-vue-components/vite";

import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    emptyOutDir: true,
    outDir: "../python-learning-server/src/main/resources/static/dist",
  },
  base: "/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      root: path.resolve(__dirname),
      app: path.resolve(__dirname, "./app"),
    },
  },
  plugins: [
    vue(),
    jsx(),
    Components({
      resolvers: [AntDesignVueResolver()],
      /* options */
    }),
  ],
});
