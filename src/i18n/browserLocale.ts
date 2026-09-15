import type { CanopLocale } from "canopui";

export const SUPPORTED_LOCALES: readonly CanopLocale[] = ["fr", "en"];

export const FALLBACK_LOCALE: CanopLocale = "fr";

function toSupportedLocale(tag: string): CanopLocale | undefined {
  const base = tag.toLowerCase().split("-")[0] ?? "";
  return SUPPORTED_LOCALES.find((locale) => locale === base);
}

export function detectBrowserLocale(tags: readonly string[]): CanopLocale {
  for (const tag of tags) {
    const locale = toSupportedLocale(tag);
    if (locale !== undefined) {
      return locale;
    }
  }
  return FALLBACK_LOCALE;
}

export function navigatorLocale(): CanopLocale {
  if (typeof navigator === "undefined") {
    return FALLBACK_LOCALE;
  }
  return detectBrowserLocale(navigator.languages ?? [navigator.language]);
}
