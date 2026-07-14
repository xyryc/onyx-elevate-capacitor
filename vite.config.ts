// @lovable.dev/vite-tanstack-config already includes tanstackStart, viteReact, tailwindcss,
// tsConfigPaths, nitro, componentTagger, env injection, path aliases and dedupe.
// We add vite-imagetools so static image imports can request AVIF/WebP variants and
// `<picture>` markup via `?w=...&format=avif;webp;jpg&as=picture` queries.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { imagetools } from "vite-imagetools";

export default defineConfig({
  plugins: [imagetools()],
  tanstackStart: {
    server: { entry: "server" },
  },
});
