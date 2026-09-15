import type { CanopLocaleMessages } from "canopui";
import en from "./locales/en.json";
import fr from "./locales/fr.json";

export const LOCALE_STORAGE_KEY = "projectcenter-locale";

export const messages: CanopLocaleMessages = { fr, en };

export {
  detectBrowserLocale,
  navigatorLocale,
  FALLBACK_LOCALE,
  SUPPORTED_LOCALES,
} from "./browserLocale";
export { projectText, type ProjectText } from "./projectText";
export { sectionText, type SectionText } from "./sectionText";
export { useDocumentLocale } from "./useDocumentLocale";
