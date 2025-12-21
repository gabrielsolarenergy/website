import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import Sitemap from "vite-plugin-sitemap";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8081,
    strictPort: true,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    // Configurarea Sitemap-ului pentru indexare Google
    Sitemap({
      hostname: "https://gabriel-solar-energy.ro",
      // Folosim dynamicRoutes pentru a evita eroarea de tip TS
      dynamicRoutes: [
        "/services",
        "/projects",
        "/systems",
        "/financing",
        "/about",
        "/contact",
        "/blog",
        "/auth/login",
        "/auth/register",
      ],
      generateRobotsTxt: true,
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
