import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { CanopI18nProvider, CanopThemeProvider } from "canopui";
import type { CanopLocale } from "canopui";
import App from "./App";
import { LOCALE_STORAGE_KEY, messages } from "./i18n";

const LANGUES: CanopLocale[] = ["fr", "en"];

const rendreApplication = (locale: CanopLocale = "fr"): string =>
  renderToStaticMarkup(
    <CanopI18nProvider locale={locale} messages={messages} storageKey={LOCALE_STORAGE_KEY}>
      <CanopThemeProvider storageKey="projectcenter-theme">
        <MemoryRouter initialEntries={["/"]}>
          <Routes>
            <Route path="/" element={<App />} />
          </Routes>
        </MemoryRouter>
      </CanopThemeProvider>
    </CanopI18nProvider>,
  );

const sansStyles = (html: string) => html.replace(/<style[^]*?<\/style>/g, "");

const libellesAccessibles = (html: string) =>
  [...sansStyles(html).matchAll(/aria-label="([^"]*)"/g)].map((occurrence) => occurrence[1] ?? "");

describe("coquille applicative - sélecteur de langue", () => {
  it("fournit exactement les deux langues attendues", () => {
    expect(Object.keys(messages).sort()).toEqual(["en", "fr"]);
  });

  it("monte un sélecteur de langue dans la barre de navigation", () => {
    const html = sansStyles(rendreApplication());

    expect(html).toContain("MuiSelect");
    expect(libellesAccessibles(html)).toContain("Langue");
  });

  it("affiche la langue courante dans le sélecteur", () => {
    LANGUES.forEach((locale) => {
      const html = sansStyles(rendreApplication(locale));

      expect(html, `langue courante absente en ${locale}`).toContain(locale.toUpperCase());
    });
  });

  it("traduit le libellé accessible du sélecteur de langue", () => {
    expect(libellesAccessibles(rendreApplication("fr"))).toContain("Langue");
    expect(libellesAccessibles(rendreApplication("en"))).toContain("Language");
  });

  it("mémorise la langue sous la clé de stockage du portail", () => {
    expect(LOCALE_STORAGE_KEY).toBe("projectcenter-locale");
  });
});

describe("coquille applicative - nom de produit non traduit", () => {
  it("conserve le titre ProjectCenter dans les deux langues", () => {
    LANGUES.forEach((locale) => {
      expect(sansStyles(rendreApplication(locale)), `titre absent en ${locale}`).toContain(
        "ProjectCenter",
      );
    });
  });
});

describe("coquille applicative - libellés de navigation traduits", () => {
  it("affiche les entrées de navigation en français", () => {
    const libelles = libellesAccessibles(rendreApplication("fr"));

    expect(libelles).toContain("Store");
    expect(libelles).toContain("Documentation");
  });

  it("n'expose aucune clé de traduction brute en libellé accessible", () => {
    LANGUES.forEach((locale) => {
      libellesAccessibles(rendreApplication(locale)).forEach((libelle) => {
        expect(libelle.trim(), `libellé vide en ${locale}`).not.toBe("");
        expect(libelle, `clé brute exposée en ${locale}`).not.toMatch(/^(nav|store|doc|canop)\./);
      });
    });
  });

  it("traduit les libellés accessibles de la barre de navigation", () => {
    const enFrancais = libellesAccessibles(rendreApplication("fr"));
    const enAnglais = libellesAccessibles(rendreApplication("en"));

    expect(enAnglais.length).toBe(enFrancais.length);
    expect(enFrancais).toContain("Navigation principale");
    expect(enAnglais).not.toContain("Navigation principale");
  });
});
