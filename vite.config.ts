import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import Sitemap from "vite-plugin-sitemap";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8081,
    strictPort: true,
  },
  plugins: [
    react(),
    cssInjectedByJsPlugin(),
    mode === "development" && componentTagger(),
    Sitemap({
      hostname: "https://gabriel-solar-energy.ro",
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
  build: {
    cssCodeSplit: false,
    chunkSizeWarningLimit: 1000, // Creștem limita pentru a evita alertele inutile
    rollupOptions: {
      output: {
        // SOLUȚIE ERORARE: Nu mai separăm React de restul codului core.
        // Separăm doar bibliotecile mari care NU afectează execuția contextului.
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // Grupează iconițele separat (ocupă cel mai mult spațiu și nu au logică de context)
            if (id.includes("lucide-react")) {
              return "vendor-ui-icons";
            }
            // Lăsăm React și restul în chunk-ul principal sau într-un singur vendor solid
            return "vendor-libs";
          }
        },
      },
    },
  },
}));
