import { useBreakpointDown, useTranslation } from "canopui";
import type { Section } from "../data/types";
import { sectionText, type SectionText } from "../i18n/sectionText";

export interface UseStoreHeroResult extends SectionText {
  compact: boolean;
}

export function useStoreHero(section: Section): UseStoreHeroResult {
  const { t } = useTranslation();
  const compact = useBreakpointDown("sm");

  return { compact, ...sectionText(t, section) };
}
