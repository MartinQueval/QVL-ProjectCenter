import type { CSSObject } from "@mui/material/styles";
import { squircleClip, tokens } from "canopui";

export type FrostedPanelEmphasis = "hero" | "section" | "dock";

const veil = (share: number): string =>
  `color-mix(in srgb, var(--canop-palette-surface-base) ${share}%, transparent)`;

const HERO_TINT = [
  "linear-gradient(150deg,",
  "color-mix(in srgb, var(--canop-palette-primary-light) 22%, transparent),",
  "color-mix(in srgb, var(--canop-palette-accent-light) 18%, transparent))",
].join(" ");

const BLUR = "blur(1.5rem) saturate(1.35)";

const NO_BACKDROP_SUPPORT =
  "@supports not ((backdrop-filter: blur(1rem)) or (-webkit-backdrop-filter: blur(1rem)))";

const FROM_MEDIUM = `@media (min-width: ${tokens.breakpoints.values.md}${tokens.breakpoints.unit})`;

function frosted(radius: string, background: string, opaqueFallback: string): CSSObject {
  return {
    ...squircleClip(radius),
    backdropFilter: BLUR,
    WebkitBackdropFilter: BLUR,
    background,
    [NO_BACKDROP_SUPPORT]: { background: opaqueFallback },
  };
}

export const frostedPanelSx: Record<FrostedPanelEmphasis, CSSObject> = {
  hero: {
    ...frosted(tokens.radius.xl, `${HERO_TINT}, ${veil(80)}`, `${HERO_TINT}, ${veil(96)}`),
    padding: tokens.spacing.md,
    [FROM_MEDIUM]: { padding: tokens.spacing.xl },
  },
  section: {
    ...frosted(tokens.radius.lg, veil(78), veil(95)),
    padding: tokens.spacing.sm,
    [FROM_MEDIUM]: { padding: tokens.spacing.md },
  },
  dock: {
    ...frosted(tokens.radius.xl, veil(90), veil(100)),
    paddingInline: tokens.spacing.xs,
    paddingBlock: tokens.spacing["3xs"],
  },
};
