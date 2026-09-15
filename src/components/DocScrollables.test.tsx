import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { CanopI18nProvider } from "canopui";
import type { CanopLocale } from "canopui";
import { DocCodeBlock } from "./DocCodeBlock";
import { DocScrollArea } from "./DocScrollArea";
import { messages } from "../i18n";

const rendre = (noeud: React.ReactNode, locale: CanopLocale = "fr"): string =>
  renderToStaticMarkup(
    <CanopI18nProvider locale={locale} messages={messages} storageKey={null}>
      {noeud}
    </CanopI18nProvider>,
  );

const balisePrincipale = (html: string) =>
  (html.match(/<[a-z][^>]*>/g) ?? []).find((balise) => !balise.startsWith("<style")) ?? "";

const libelleAccessible = (html: string) => balisePrincipale(html).match(/aria-label="([^"]*)"/)?.[1] ?? "";

describe("DocCodeBlock - exposition accessible", () => {
  const html = rendre(<DocCodeBlock>npm run build</DocCodeBlock>);

  it("expose un rôle group", () => {
    expect(balisePrincipale(html)).toContain('role="group"');
  });

  it("porte un libellé accessible", () => {
    expect(balisePrincipale(html)).toMatch(/aria-label="[^"]+"/);
  });

  it("reste atteignable au clavier", () => {
    expect(balisePrincipale(html)).toContain('tabindex="0"');
  });

  it("restitue son contenu", () => {
    expect(html).toContain("npm run build");
  });
});

describe("DocCodeBlock - libellé accessible traduit", () => {
  it("n'expose jamais une clé de traduction brute", () => {
    (["fr", "en"] as CanopLocale[]).forEach((locale) => {
      const libelle = libelleAccessible(rendre(<DocCodeBlock>npm run build</DocCodeBlock>, locale));

      expect(libelle.trim(), `libellé vide en ${locale}`).not.toBe("");
      expect(libelle, `clé brute exposée en ${locale}`).not.toMatch(/^doc\./);
    });
  });

  it("change de libellé selon la langue affichée", () => {
    const enFrancais = libelleAccessible(rendre(<DocCodeBlock>npm run build</DocCodeBlock>, "fr"));
    const enAnglais = libelleAccessible(rendre(<DocCodeBlock>npm run build</DocCodeBlock>, "en"));

    expect(enAnglais).not.toBe(enFrancais);
  });
});

describe("DocScrollArea - exposition accessible", () => {
  const html = rendre(
    <DocScrollArea label="Tableau des ports">
      <span>contenu</span>
    </DocScrollArea>,
  );

  it("expose un rôle group", () => {
    expect(balisePrincipale(html)).toContain('role="group"');
  });

  it("reprend le libellé fourni", () => {
    expect(balisePrincipale(html)).toContain('aria-label="Tableau des ports"');
  });

  it("reste atteignable au clavier", () => {
    expect(balisePrincipale(html)).toContain('tabindex="0"');
  });
});
