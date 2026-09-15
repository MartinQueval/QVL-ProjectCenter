import type { CSSProperties } from "react";
import { tokens, useBreakpointDown } from "canopui";

export interface UseStoreHeroResult {
  compact: boolean;
  bandStyle: CSSProperties;
}

const BAND_BASE: CSSProperties = {
  borderRadius: "var(--canop-radius-xl)",
  border: "0.0625rem solid var(--canop-palette-divider)",
  backgroundImage: [
    "linear-gradient(150deg,",
    "color-mix(in srgb, var(--canop-palette-primary-light) 20%, transparent),",
    "color-mix(in srgb, var(--canop-palette-accent-light) 16%, transparent))",
  ].join(" "),
};

const COMPACT_BAND: CSSProperties = { ...BAND_BASE, padding: tokens.spacing.sm };

const WIDE_BAND: CSSProperties = { ...BAND_BASE, padding: tokens.spacing.xl };

export function useStoreHero(): UseStoreHeroResult {
  const compact = useBreakpointDown("sm");

  return { compact, bandStyle: compact ? COMPACT_BAND : WIDE_BAND };
}
