import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tanstackStart({ server: { entry: "server" } }),
    nitro({ 
      preset: "vercel",
      externals: {
        traceInclude: ["./.vercel/output/functions/__server.func/_ssr/**/*.mjs"]
      }
    }),
    react(),
    tailwindcss(),
    tsconfigPaths(),
  ],
});
