// Generates a placeholder index.html in the Capacitor web assets directory
// (.output/public) so that `cap copy` / `cap sync` / `cap run` can scaffold the
// native project. This app is server-rendered (TanStack Start + Nitro), so a
// static index.html is never produced by `vite build`. At runtime Capacitor's
// live-reload (`-l`) points the WebView at the dev server via `server.url`, so
// this placeholder is never actually served to users.
import { writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const target = resolve(root, ".output/public/index.html");

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <title>Onyx Elevate</title>
  </head>
  <body>
    <div id="app">Loading…</div>
  </body>
</html>
`;

await mkdir(dirname(target), { recursive: true });
await writeFile(target, html, "utf8");
console.log(`Wrote placeholder ${target}`);
