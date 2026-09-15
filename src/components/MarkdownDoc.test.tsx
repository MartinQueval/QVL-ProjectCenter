import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { CanopI18nProvider } from "canopui";
import type { CanopLocale } from "canopui";
import { MarkdownDoc } from "./MarkdownDoc";
import { messages } from "../i18n";

const DOC_PATH = "QVL-CustHome/CH-Api-Budgy/README.md";

function rendre(markdown: string, locale: CanopLocale = "fr"): string {
  return renderToStaticMarkup(
    <CanopI18nProvider locale={locale} messages={messages} storageKey={null}>
      <MemoryRouter>
        <MarkdownDoc markdown={markdown} docPath={DOC_PATH} />
      </MemoryRouter>
    </CanopI18nProvider>,
  );
}

function balises(html: string, tagName: string): string[] {
  return html.match(new RegExp(`<${tagName}[^>]*>`, "g")) ?? [];
}

describe("MarkdownDoc - ancres de titres", () => {
  it("génère un id sur un titre de niveau 2", () => {
    const html = rendre("## Installation\n");

    expect(html).toContain('id="installation"');
  });

  it("génère un id exploitable par un lien de sommaire", () => {
    const html = rendre("- [Installation](#installation)\n\n## Installation\n");

    expect(html).toContain('id="installation"');
    expect(html).toContain('href="#installation"');
  });

  it("ne préfixe pas les id de titres", () => {
    const html = rendre("# Guide\n\n## Usage\n\n### Détails\n");

    expect(html).not.toContain("user-content-");
    expect(html).toContain('id="guide"');
    expect(html).toContain('id="usage"');
  });
});

describe("MarkdownDoc - liens d'ancrage", () => {
  it("n'ouvre pas un lien d'ancrage dans un nouvel onglet", () => {
    const html = rendre("[Aller à l'usage](#usage)\n");

    expect(html).toContain('href="#usage"');
    expect(html).not.toContain('target="_blank"');
  });

  it("n'annonce pas un lien d'ancrage comme ouvrant un nouvel onglet", () => {
    const html = rendre("[Aller à l'usage](#usage)\n");

    expect(html).not.toContain("nouvel onglet");
  });

  it("n'ouvre dans un nouvel onglet aucune entrée d'un sommaire", () => {
    const html = rendre(
      "## Sommaire\n\n- [Usage](#usage)\n- [Installation](#installation)\n\n## Usage\n\n## Installation\n",
    );

    expect(html).not.toContain('target="_blank"');
    expect(html).not.toContain("nouvel onglet");
  });

  it("continue d'ouvrir les liens externes dans un nouvel onglet", () => {
    const html = rendre("[Site QVL](https://qvl.com)\n");

    expect(html).toContain('target="_blank"');
    expect(html).toContain("nouvel onglet");
  });
});

describe("MarkdownDoc - assainissement du contenu brut", () => {
  it("retire le href d'un lien mailto", () => {
    const html = rendre('<a href="mailto:team@qvl.com">contact</a>\n');

    expect(html).not.toContain("mailto:");
  });

  it("retire le href d'un lien tel", () => {
    const html = rendre('<a href="tel:+33123456789">appeler</a>\n');

    expect(html).not.toContain("tel:+33");
  });

  it("retire l'id des éléments qui ne sont pas des titres", () => {
    const html = rendre('<div id="attributes">clobbering</div>\n\n<p id="ownerDocument">texte</p>\n');

    expect(balises(html, "div").some((balise) => balise.includes("id="))).toBe(false);
    expect(balises(html, "p").some((balise) => balise.includes("id="))).toBe(false);
  });

  it("neutralise un script injecté", () => {
    const html = rendre('<script>alert(1)</script>\n');

    expect(html).not.toContain("<script");
  });

  it("neutralise un gestionnaire d'évènement injecté", () => {
    const html = rendre('<img src="https://qvl.com/x.png" onerror="alert(1)" />\n');

    expect(html).not.toContain("onerror");
  });
});

describe("MarkdownDoc - conteneurs défilants", () => {
  it("place un tableau dans un conteneur focusable au clavier", () => {
    const html = rendre("| Clé | Valeur |\n| --- | --- |\n| a | b |\n");

    expect(html).toContain("<table");
    expect(html).toMatch(/tabindex="0"[^>]*>\s*<table|<[^>]*tabindex="0"[^>]*>[^<]*<table/);
  });

  it("place un bloc de code dans un conteneur focusable au clavier", () => {
    const html = rendre("```bash\nnpm run dev\n```\n");

    expect(html).toContain("<pre");
    expect(html).toContain('tabindex="0"');
  });

  it("étiquette les conteneurs défilants pour les technologies d'assistance", () => {
    const tableau = rendre("| Clé | Valeur |\n| --- | --- |\n| a | b |\n");
    const code = rendre("```bash\nnpm run dev\n```\n");

    expect(tableau).toContain("aria-label");
    expect(code).toContain("aria-label");
  });
});

describe("MarkdownDoc - textes traduits", () => {
  const libellesAccessibles = (html: string) =>
    [...html.matchAll(/aria-label="([^"]*)"/g)].map((occurrence) => occurrence[1] ?? "");

  const TABLEAU = "| Clé | Valeur |\n| --- | --- |\n| a | b |\n";
  const CODE = "```bash\nnpm run dev\n```\n";
  const LIEN_EXTERNE = "[Site QVL](https://qvl.com)\n";

  it("n'expose aucune clé de traduction brute en libellé accessible", () => {
    (["fr", "en"] as CanopLocale[]).forEach((locale) => {
      [TABLEAU, CODE, LIEN_EXTERNE].forEach((markdown) => {
        libellesAccessibles(rendre(markdown, locale)).forEach((libelle) => {
          expect(libelle.trim(), `libellé vide en ${locale}`).not.toBe("");
          expect(libelle, `clé brute exposée en ${locale}`).not.toMatch(/^doc\./);
        });
      });
    });
  });

  it("traduit le libellé accessible du tableau selon la langue affichée", () => {
    const enFrancais = libellesAccessibles(rendre(TABLEAU, "fr"));
    const enAnglais = libellesAccessibles(rendre(TABLEAU, "en"));

    expect(enAnglais.length).toBe(enFrancais.length);
    expect(enAnglais).not.toEqual(enFrancais);
  });

  it("annonce l'ouverture d'un lien externe dans la langue affichée", () => {
    expect(rendre(LIEN_EXTERNE, "fr")).toContain("nouvel onglet");
    expect(rendre(LIEN_EXTERNE, "en")).toContain("new tab");
    expect(rendre(LIEN_EXTERNE, "en")).not.toContain("nouvel onglet");
  });
});
