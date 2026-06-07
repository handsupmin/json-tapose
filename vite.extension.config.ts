import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

const rootDir = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(rootDir, "dist-extension");

const copyExtensionAssets = (): Plugin => ({
  name: "copy-extension-assets",
  closeBundle() {
    mkdirSync(resolve(distDir, "icons"), { recursive: true });
    copyFileSync(
      resolve(rootDir, "extension/manifest.json"),
      resolve(distDir, "manifest.json")
    );
    copyFileSync(resolve(rootDir, "public/logo.svg"), resolve(distDir, "logo.svg"));
    copyFileSync(
      resolve(rootDir, "public/favicon/favicon-96x96.png"),
      resolve(distDir, "icons/icon-96.png")
    );
    copyFileSync(
      resolve(rootDir, "public/favicon/web-app-manifest-192x192.png"),
      resolve(distDir, "icons/icon-192.png")
    );
  },
});

export default defineConfig({
  base: "./",
  plugins: [tailwindcss(), react(), copyExtensionAssets()],
  build: {
    outDir: "dist-extension",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(rootDir, "extension/popup.html"),
      },
      output: {
        assetFileNames: "assets/[name][extname]",
        chunkFileNames: "assets/[name].js",
        entryFileNames: "assets/[name].js",
      },
    },
  },
});
