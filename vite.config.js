import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

/** Production HTML tweaks (safe on any static host). */
function productionHtmlPlugin() {
  return {
    name: "production-html",
    apply: "build",
    transformIndexHtml(html) {
      return html.replace(/\s+crossorigin(?:="[^"]*")?/gi, "");
    },
    closeBundle() {
      const dist = path.resolve(rootDir, "dist");
      const indexHtml = path.join(dist, "index.html");
      if (fs.existsSync(indexHtml)) {
        fs.copyFileSync(indexHtml, path.join(dist, "404.html"));
      }
    },
  };
}

// Default `outDir` is `dist` — matches Vercel’s expectation for Vite.
// Relative `base` keeps asset URLs correct on Vercel (`/` or any subdomain).
export default defineConfig({
  plugins: [react(), productionHtmlPlugin()],
  base: "./",
});
