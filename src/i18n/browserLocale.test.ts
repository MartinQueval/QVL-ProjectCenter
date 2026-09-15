import { describe, expect, it } from "vitest";
import { detectBrowserLocale, FALLBACK_LOCALE, SUPPORTED_LOCALES } from "./browserLocale";

describe("detectBrowserLocale - langue issue du navigateur", () => {
  it("retient l'anglais pour une variante régionale anglaise", () => {
    expect(detectBrowserLocale(["en-GB"])).toBe("en");
  });

  it("retombe sur le français pour une langue non supportée", () => {
    expect(detectBrowserLocale(["de"])).toBe("fr");
  });

  it("retombe sur le français quand le navigateur n'annonce aucune langue", () => {
    expect(detectBrowserLocale([])).toBe("fr");
  });

  it("retient la première langue supportée de la liste de préférences", () => {
    expect(detectBrowserLocale(["en-US", "fr"])).toBe("en");
  });

  it("retient le français quand il est annoncé avant l'anglais", () => {
    expect(detectBrowserLocale(["fr-CA", "en"])).toBe("fr");
  });

  it("ignore les langues non supportées placées en tête", () => {
    expect(detectBrowserLocale(["de-DE", "es", "en"])).toBe("en");
  });

  it("ignore la casse des étiquettes de langue", () => {
    expect(detectBrowserLocale(["EN-gb"])).toBe("en");
  });

  it("ne renvoie jamais autre chose qu'une langue supportée", () => {
    [["zz"], [""], ["fr"], ["en"], []].forEach((tags) => {
      expect(SUPPORTED_LOCALES).toContain(detectBrowserLocale(tags));
    });
  });

  it("déclare le français comme langue de repli", () => {
    expect(FALLBACK_LOCALE).toBe("fr");
  });
});
