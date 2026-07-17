import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

// Port lu depuis PROJECTCENTER_PORT (.env), fallback 3002 (SCRUM-320).
// loadEnv avec préfixe "" charge toutes les variables, pas seulement VITE_*,
// car PROJECTCENTER_PORT n'est pas exposé au client (config serveur uniquement).

const contentSecurityPolicy = [
  "default-src 'self'",
  "connect-src 'self' https://gitlab.com",
  "img-src 'self' data: https://gitlab.com https://img.shields.io",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "script-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

function cspMetaPlugin(): Plugin {
  return {
    name: "projectcenter-csp-meta",
    apply: "build",
    transformIndexHtml() {
      return [
        {
          tag: "meta",
          attrs: {
            "http-equiv": "Content-Security-Policy",
            content: contentSecurityPolicy,
          },
          injectTo: "head-prepend",
        },
      ];
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const port = Number(env.PROJECTCENTER_PORT) || 3002;

  return {
    plugins: [react(), cspMetaPlugin()],
    server: {
      port,
    },
    preview: {
      port,
    },
  };
});
