import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
// GitHub Pages project site: https://<user>.github.io/Portfolio/
export default defineConfig({
  plugins: [react()],
  base: "/Portfolio/",
  build: {
    // Publish this folder via GitHub Pages: Settings → Pages → Branch main, folder “/docs”.
    outDir: "docs",
    emptyOutDir: true,
  },
});
