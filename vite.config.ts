import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// Port lu depuis PROJECTCENTER_PORT (.env), fallback 3002 (SCRUM-320).
// loadEnv avec préfixe "" charge toutes les variables, pas seulement VITE_*,
// car PROJECTCENTER_PORT n'est pas exposé au client (config serveur uniquement).
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const port = Number(env.PROJECTCENTER_PORT) || 3002;

  return {
    plugins: [react()],
    server: {
      port,
    },
    preview: {
      port,
    },
  };
});
