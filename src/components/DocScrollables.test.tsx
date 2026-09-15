import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { DocCodeBlock } from "./DocCodeBlock";
import { DocScrollArea } from "./DocScrollArea";

const balisePrincipale = (html: string) =>
  (html.match(/<[a-z][^>]*>/g) ?? []).find((balise) => !balise.startsWith("<style")) ?? "";

describe("DocCodeBlock - exposition accessible", () => {
  const html = renderToStaticMarkup(<DocCodeBlock>npm run build</DocCodeBlock>);

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

describe("DocScrollArea - exposition accessible", () => {
  const html = renderToStaticMarkup(
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
