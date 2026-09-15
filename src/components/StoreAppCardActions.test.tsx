import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { CanopI18nProvider } from "canopui";
import type { CanopLocale } from "canopui";
import { StoreAppCardActions } from "./StoreAppCardActions";
import { StoreShortcutAction } from "./StoreShortcutAction";
import { messages } from "../i18n";
import type { Project } from "../data/types";

const APP_NAME = "Budgy";

const projet = (url?: string): Project => ({
  id: "ch-portal-budgy",
  section: "custhome",
  name: APP_NAME,
  docPath: "QVL-CustHome/CH-Portal-Budgy/README.md",
  store: true,
  url,
});

const noop = () => {};

const rendre = (noeud: React.ReactNode, locale: CanopLocale = "fr"): string =>
  renderToStaticMarkup(
    <CanopI18nProvider locale={locale} messages={messages} storageKey={null}>
      {noeud}
    </CanopI18nProvider>,
  );

const rendreActions = (canOpenApp: boolean, locale: CanopLocale = "fr"): string =>
  rendre(
    <StoreAppCardActions
      name={APP_NAME}
      canOpenApp={canOpenApp}
      onOpenApp={noop}
      onOpenDoc={noop}
    />,
    locale,
  );

const nomsAccessibles = (html: string): string[] =>
  [...html.matchAll(/aria-label="([^"]*)"/g)].map((match) => match[1] ?? "");

describe("actions de la carte du store - noms accessibles", () => {
  it("expose un nom accessible sur le bouton icône de documentation", () => {
    const noms = nomsAccessibles(rendreActions(true));

    expect(noms).toContain(`Documentation de ${APP_NAME}`);
  });

  it("expose un nom accessible non vide sur le bouton icône de téléchargement", () => {
    const html = rendre(<StoreShortcutAction project={projet("https://budgy.qvl")} />);
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

describe("actions de la carte du store - libellés traduits", () => {
  it("traduit le bouton Ouvrir en anglais", () => {
    const html = rendreActions(true, "en");

    expect(html).not.toContain("store.card.open");
    expect(html).not.toContain("Ouvrir");
    expect(html).toContain("Open");
  });

  it("traduit le nom accessible du bouton de documentation en anglais", () => {
    const noms = nomsAccessibles(rendreActions(true, "en"));

    expect(noms.length).toBeGreaterThan(0);
    noms.forEach((nom) => {
      expect(nom).not.toMatch(/^store\./);
      expect(nom).not.toContain("Documentation de ");
    });
    expect(noms.some((nom) => nom.includes(APP_NAME))).toBe(true);
  });

  it("traduit le nom accessible du bouton de téléchargement en anglais", () => {
    const noms = nomsAccessibles(rendre(<StoreShortcutAction project={projet("https://budgy.qvl")} />, "en"));

    expect(noms.length).toBeGreaterThan(0);
    noms.forEach((nom) => {
      expect(nom).not.toMatch(/^shortcut\./);
      expect(nom.trim()).not.toBe("");
    });
  });

  it("n'affiche aucune clé de traduction brute dans les deux langues", () => {
    (["fr", "en"] as CanopLocale[]).forEach((locale) => {
      const html = rendreActions(true, locale);

      expect(html, `clé brute affichée en ${locale}`).not.toMatch(/>[a-z]+(\.[a-zA-Z]+){2,}</);
    });
  });
});

describe("actions de la carte du store - téléchargement conditionné à l'url", () => {
  it("rend le raccourci de téléchargement quand le projet déclare une url", () => {
    const html = rendre(<StoreShortcutAction project={projet("https://budgy.qvl")} />);

    expect(html).not.toBe("");
  });

  it("ne rend aucun raccourci de téléchargement quand le projet n'a pas d'url", () => {
    const html = rendre(<StoreShortcutAction project={projet()} />);

    expect(html).toBe("");
  });
});
