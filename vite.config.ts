import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        yamlCompare: path.resolve(__dirname, "yaml-compare/index.html"),
        treeviewer: path.resolve(__dirname, "treeviewer/index.html"),
        yamlTreeviewer: path.resolve(
          __dirname,
          "treeviewer/yaml-compare/index.html"
        ),
        clientSideJsonDiff: path.resolve(
          __dirname,
          "client-side-json-diff/index.html"
        ),
        semanticJsonDiff: path.resolve(
          __dirname,
          "semantic-json-diff/index.html"
        ),
      },
    },
  },
  server: {
    port: 8173,
  },
});
