import { describe, expect, it } from "vitest";
import { sanitize } from "hast-util-sanitize";
import type { Element, Root } from "hast";
import { markdownSanitizeSchema } from "./markdownSanitizeSchema";

const HEADINGS = ["h1", "h2", "h3", "h4", "h5", "h6"];
const NON_HEADINGS = [
  "div",
  "p",
  "span",
  "a",
  "img",
  "table",
  "tr",
  "td",
  "code",
  "pre",
  "ul",
  "li",
  "blockquote",
  "section",
];

function element(tagName: string, properties: Record<string, unknown>): Element {
  return { type: "element", tagName, properties, children: [] };
}

function assainir(node: Element): Element | undefined {
  const root: Root = { type: "root", children: [node] };
  const resultat = sanitize(root, markdownSanitizeSchema) as Root;

  return resultat.children.find((child): child is Element => child.type === "element");
}

function proprietes(node: Element): Record<string, unknown> {
  return (assainir(node)?.properties ?? {}) as Record<string, unknown>;
}

describe("markdownSanitizeSchema - protocoles de lien", () => {
  it.each(["mailto:team@qvl.com", "tel:+33123456789", "xmpp:team@qvl.com", "irc://qvl.com/canal"])(
    "retire l'attribut href du protocole %s",
    (href) => {
      const resultat = proprietes(element("a", { href }));

      expect(Object.hasOwn(resultat, "href")).toBe(false);
    },
  );

  it("retire l'attribut href du protocole javascript", () => {
    const resultat = proprietes(element("a", { href: "javascript:alert(1)" }));

    expect(Object.hasOwn(resultat, "href")).toBe(false);
  });

  it("conserve les href http et https", () => {
    expect(proprietes(element("a", { href: "https://qvl.com" })).href).toBe("https://qvl.com");
    expect(proprietes(element("a", { href: "http://qvl.com" })).href).toBe("http://qvl.com");
  });

  it("conserve les href relatifs", () => {
    expect(proprietes(element("a", { href: "../README.md" })).href).toBe("../README.md");
    expect(proprietes(element("a", { href: "./guide.md" })).href).toBe("./guide.md");
    expect(proprietes(element("a", { href: "/doc/custhome" })).href).toBe("/doc/custhome");
  });

  it("conserve les href d'ancrage", () => {
    expect(proprietes(element("a", { href: "#usage" })).href).toBe("#usage");
    expect(proprietes(element("a", { href: "#titre-accentué" })).href).toBe("#titre-accentué");
  });
});

describe("markdownSanitizeSchema - attribut id", () => {
  it.each(HEADINGS)("conserve l'id sur %s", (tagName) => {
    expect(proprietes(element(tagName, { id: "usage" })).id).toBe("usage");
  });

  it.each(HEADINGS)("ne préfixe pas l'id de %s", (tagName) => {
    const resultat = proprietes(element(tagName, { id: "installation" }));

    expect(resultat.id).toBe("installation");
    expect(String(resultat.id)).not.toContain("user-content-");
  });

  it.each(NON_HEADINGS)("retire l'id sur %s", (tagName) => {
    const resultat = proprietes(element(tagName, { id: "attributes" }));

    expect(Object.hasOwn(resultat, "id")).toBe(false);
  });

  it("retire l'id de clobbering sur un formulaire et ses champs", () => {
    expect(Object.hasOwn(proprietes(element("form", { id: "attributes" })), "id")).toBe(false);
    expect(Object.hasOwn(proprietes(element("input", { id: "ownerDocument" })), "id")).toBe(false);
  });
});

describe("markdownSanitizeSchema - durcissement conservé", () => {
  it.each([
    ["script", { type: "text/javascript" }],
    ["iframe", { src: "https://evil.com" }],
    ["object", { data: "https://evil.com" }],
    ["embed", { src: "https://evil.com" }],
    ["style", {}],
    ["base", { href: "https://evil.com" }],
  ])("retire l'élément %s", (tagName, properties) => {
    expect(assainir(element(tagName, properties))).toBeUndefined();
  });

  it.each(["onClick", "onError", "onLoad", "onMouseOver"])(
    "retire le gestionnaire d'évènement %s",
    (handler) => {
      const resultat = proprietes(element("div", { [handler]: "alert(1)" }));

      expect(Object.hasOwn(resultat, handler)).toBe(false);
    },
  );

  it("retire l'attribut style", () => {
    const resultat = proprietes(element("p", { style: "position:fixed;inset:0" }));

    expect(Object.hasOwn(resultat, "style")).toBe(false);
  });

  it("retire un src d'image au protocole interdit", () => {
    const resultat = proprietes(element("img", { src: "javascript:alert(1)" }));

    expect(Object.hasOwn(resultat, "src")).toBe(false);
  });

  it("conserve les éléments de documentation légitimes", () => {
    expect(assainir(element("table", {}))?.tagName).toBe("table");
    expect(assainir(element("code", {}))?.tagName).toBe("code");
    expect(assainir(element("pre", {}))?.tagName).toBe("pre");
    expect(proprietes(element("img", { src: "https://qvl.com/logo.png" })).src).toBe(
      "https://qvl.com/logo.png",
    );
  });
});
