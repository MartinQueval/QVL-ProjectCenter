import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { StoreAppCardActions } from "./StoreAppCardActions";
import { StoreShortcutAction } from "./StoreShortcutAction";
import type { Project } from "../data/types";

const APP_NAME = "Budgy";

const projet = (url?: string): Project => ({
  id: "ch-portal-budgy",
  section: "custhome",
  name: APP_NAME,
  description: "Gestion de budget",
  docPath: "QVL-CustHome/CH-Portal-Budgy/README.md",
  store: true,
  url,
});

const noop = () => {};

const rendreActions = (canOpenApp: boolean, actions?: React.ReactNode): string =>
  renderToStaticMarkup(
    <StoreAppCardActions
      name={APP_NAME}
      canOpenApp={canOpenApp}
      onOpenApp={noop}
      onOpenDoc={noop}
      actions={actions}
    />,
  );

const nomsAccessibles = (html: string): string[] =>
  [...html.matchAll(/aria-label="([^"]*)"/g)].map((match) => match[1]);

describe("actions de la carte du store - noms accessibles", () => {
  it("expose un nom accessible sur le bouton icône de documentation", () => {
    const noms = nomsAccessibles(rendreActions(true));

    expect(noms).toContain(`Documentation de ${APP_NAME}`);
  });

  it("expose un nom accessible non vide sur le bouton icône de téléchargement", () => {
    const html = renderToStaticMarkup(<StoreShortcutAction project={projet("https://budgy.qvl")} />);
    const noms = nomsAccessibles(html);

    expect(noms.length).toBeGreaterThan(0);
    noms.forEach((nom) => {
      expect(nom.trim()).not.toBe("");
    });
    expect(noms.some((nom) => nom.includes(APP_NAME))).toBe(true);
  });

  it("libelle le bouton Ouvrir avec le nom de l'app", () => {
    const html = rendreActions(true);

    expect(html).toContain("Ouvrir");
    expect(html).toContain(APP_NAME);
  });
});

describe("actions de la carte du store - téléchargement conditionné à l'url", () => {
  it("rend le raccourci de téléchargement quand le projet déclare une url", () => {
    const html = renderToStaticMarkup(<StoreShortcutAction project={projet("https://budgy.qvl")} />);

    expect(html).not.toBe("");
  });

  it("ne rend aucun raccourci de téléchargement quand le projet n'a pas d'url", () => {
    const html = renderToStaticMarkup(<StoreShortcutAction project={projet()} />);

    expect(html).toBe("");
  });
});
