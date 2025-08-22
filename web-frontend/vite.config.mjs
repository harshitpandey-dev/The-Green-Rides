import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      include: "**/*.{jsx,tsx,js,ts}",
    }),
  ],
  server: {
    port: 5174,
    open: false,
  },
  build: {
    outDir: "build",
  },
  define: {
    global: "globalThis",
  },
  envPrefix: "VITE_",
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx",
      },
    },
  },
});
