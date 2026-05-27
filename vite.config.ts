import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The SDK playground is served as a sub-path of the docs site:
//   prod:  https://docs.quipier.com/example
//   dev:   https://docs-dev.quipier.com/example
//   local: http://localhost:5174/example
// `base` rewrites asset URLs to /example/*, and the build is emitted to
// dist/example so wrangler (serving ./dist at the domain root) exposes it at
// /example while leaving / for the docs landing (static/index.html).
export default defineConfig({
  base: "/example/",
  plugins: [react()],
  server: { port: 5174 },
  build: { outDir: "dist/example", emptyOutDir: true },
});
