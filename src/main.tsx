import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { CanopI18nProvider, CanopThemeProvider } from "canopui";
import "canopui/styles.css";
import { LOCALE_STORAGE_KEY, messages, navigatorLocale } from "./i18n";
import { router } from "./router";

const container = document.getElementById("root");
if (!container) {
  throw new Error("Élément racine introuvable");
}

createRoot(container).render(
  <StrictMode>
    <CanopI18nProvider
      locale={navigatorLocale()}
      messages={messages}
      storageKey={LOCALE_STORAGE_KEY}
    >
      <CanopThemeProvider storageKey="projectcenter-theme">
        <RouterProvider router={router} />
      </CanopThemeProvider>
    </CanopI18nProvider>
  </StrictMode>,
);
