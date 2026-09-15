import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { CanopI18nProvider, CanopThemeProvider } from "canopui";
import type { CanopLocale } from "canopui";
import { HomePage } from "./HomePage";
import { DocIndexPage } from "./DocIndexPage";
import { messages } from "../i18n";
import fr from "../i18n/locales/fr.json";
import en from "../i18n/locales/en.json";

const LANGUES: CanopLocale[] = ["fr", "en"];

const PAGES: ReadonlyArray<readonly [string, () => React.ReactElement]> = [
  ["accueil du store", () => <HomePage />],
  ["index de la documentation", () => <DocIndexPage />],
];

const rendre = (page: () => React.ReactElement, locale: CanopLocale): string =>
  renderToStaticMarkup(
    <CanopI18nProvider locale={locale} messages={messages} storageKey={null}>
      <CanopThemeProvider storageKey="projectcenter-theme">
        <MemoryRouter initialEntries={["/"]}>{page()}</MemoryRouter>
      </CanopThemeProvider>
    </CanopI18nProvider>,
  );

const sansStyles = (html: string) => html.replace(/<style[^]*?<\/style>/g, "");

const libellesAccessibles = (html: string) =>
  [...sansStyles(html).matchAll(/aria-label="([^"]*)"/g)].map((occurrence) => occurrence[1] ?? "");

const CLES_CONNUES = Object.keys(fr as Record<string, string>);

describe("pages du portail - absence de clé de traduction affichée", () => {
  PAGES.forEach(([nom, page]) => {
    LANGUES.forEach((locale) => {
      it(`n'affiche aucune clé brute sur ${nom} en ${locale}`, () => {
        const html = sansStyles(rendre(page, locale));
        const clesAffichees = CLES_CONNUES.filter((cle) => html.includes(`>${cle}<`));

        expect(clesAffichees).toEqual([]);
      });

      it(`n'expose aucune clé brute en libellé accessible sur ${nom} en ${locale}`, () => {
        libellesAccessibles(rendre(page, locale)).forEach((libelle) => {
          expect(libelle.trim(), `libellé vide sur ${nom} en ${locale}`).not.toBe("");
          expect(CLES_CONNUES, `clé brute exposée sur ${nom} en ${locale}`).not.toContain(libelle);
        });
      });
    });
  });
});

describe("pages du portail - bascule complète entre les deux langues", () => {
  PAGES.forEach(([nom, page]) => {
    it(`restitue ${nom} dans la langue affichée`, () => {
      const enFrancais = sansStyles(rendre(page, "fr"));
      const enAnglais = sansStyles(rendre(page, "en"));

      expect(enAnglais).not.toBe(enFrancais);
    });

    it(`ne laisse aucun texte français sur ${nom} en anglais`, () => {
      const html = sansStyles(rendre(page, "en"));
      const textesFrancaisResiduels = Object.entries(fr as Record<string, string>)
        .filter(([cle, valeur]) => {
          const traduction = (en as Record<string, string>)[cle] ?? "";
          return traduction !== valeur && !valeur.includes("{") && valeur.length > 12;
        })
        .map(([, valeur]) => valeur)
        .filter((valeur) => html.includes(valeur));

      expect(textesFrancaisResiduels).toEqual([]);
    });
  });
});

describe("pages du portail - libellés accessibles traduits", () => {
  PAGES.forEach(([nom, page]) => {
    it(`traduit les libellés accessibles de ${nom}`, () => {
      const enFrancais = libellesAccessibles(rendre(page, "fr"));
      const enAnglais = libellesAccessibles(rendre(page, "en"));

      expect(enAnglais.length, `libellés manquants sur ${nom}`).toBe(enFrancais.length);
      expect(enAnglais.length).toBeGreaterThan(0);
      expect(enAnglais, `libellés non traduits sur ${nom}`).not.toEqual(enFrancais);
    });
  });
});
