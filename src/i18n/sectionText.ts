import type { CanopTranslate } from "canopui";
import type { Section } from "../data/types";
import { optionalText } from "./optionalText";

export interface SectionText {
  tagline?: string;
  appsLabel: string;
}

export function sectionText(t: CanopTranslate, section: Section): SectionText {
  return {
    tagline: optionalText(t, `sections.${section.slug}.tagline`),
    appsLabel: t("store.section.apps", { section: section.label }),
  };
}
