import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ChThemeProvider } from "canopui";
import "canopui/styles.css";
import { router } from "./router";

const container = document.getElementById("root");
if (!container) {
  throw new Error("Élément racine introuvable");
}

createRoot(container).render(
  <StrictMode>
    <ChThemeProvider storageKey="projectcenter-theme">
      <RouterProvider router={router} />
    </ChThemeProvider>
  </StrictMode>,
);
