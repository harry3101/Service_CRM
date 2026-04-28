// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
// Import the ESM build explicitly: the package "main" is index.cjs and require("lovable-tagger") fails on
// Node (ERR_REQUIRE_ESM) during `vite build` on Render. See dist/index.js vs dist/index.cjs in the package.
import { defineConfig } from "@lovable.dev/vite-tanstack-config/dist/index.js";

export default defineConfig({
  vite: {
    // Root-relative asset URLs (avoids /assets/*.js 404s when the app is served from origin path /).
    base: "/",
  },
});
