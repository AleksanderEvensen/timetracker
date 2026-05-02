import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import { devtools } from "@tanstack/devtools-vite";

// @ts-expect-error process is a nodejs global
const host = process.env.TAURI_DEV_HOST;

const useSsrPrerender = false;

const sharedPrerenderOptions = {
  enabled: true,
  autoSubfolderIndex: true,
} as const;

// https://vite.dev/config/
export default defineConfig(async () => ({
  plugins: [
    devtools(),
    nitro(),
    tailwindcss(),
    tanstackStart({
      spa: !useSsrPrerender
        ? {
            enabled: true,
            prerender: {
              ...sharedPrerenderOptions,
              outputPath: "/index.html",
              crawlLinks: false,
              retryCount: 0,
            },
          }
        : undefined,
      prerender: useSsrPrerender
        ? {
            ...sharedPrerenderOptions,
            crawlLinks: true,
            retryCount: 3,
            retryDelay: 1000,
          }
        : undefined,
    }),
    react(),
  ],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent Vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      // 3. tell Vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
}));
