import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { nitro } from "nitro/vite";

// Configure Nitro preset for Vercel deployment when building for production.
if (process.env.NODE_ENV === "production") {
  process.env.NITRO_PRESET = "vercel";
}

// Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
export default defineConfig({
  cloudflare: false,
  tanstackStart: {
    server: { 
      entry: "server",
      preset: "vercel",
    },
  },
  plugins: [
    nitro(),
  ],
});
