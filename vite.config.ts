import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { nitro } from "nitro/vite";

export default defineConfig({
  cloudflare: false,
  tanstackStart: {
    server: {
      preset: "vercel",
    },
  },
  plugins: [
    nitro({
      preset: "vercel",
    }),
  ],
});
