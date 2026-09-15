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

const HERO_BLUR = "blur(0.75rem) saturate(1.2)";
const PANEL_BLUR = "blur(1.25rem) saturate(1.3)";

const NO_BACKDROP_SUPPORT =
  "@supports not ((backdrop-filter: blur(1rem)) or (-webkit-backdrop-filter: blur(1rem)))";

const FROM_MEDIUM = `@media (min-width: ${tokens.breakpoints.values.md}${tokens.breakpoints.unit})`;

interface FrostedOptions {
  radius: string;
  blur: string;
  background: string;
  opaqueFallback: string;
}

function frosted({ radius, blur, background, opaqueFallback }: FrostedOptions): CSSObject {
  return {
    ...squircleClip(radius),
    backdropFilter: blur,
    WebkitBackdropFilter: blur,
    background,
    [NO_BACKDROP_SUPPORT]: { background: opaqueFallback },
  };
}

export const frostedPanelSx: Record<FrostedPanelEmphasis, CSSObject> = {
  hero: {
    ...frosted({
      radius: tokens.radius.xl,
      blur: HERO_BLUR,
      background: `${HERO_TINT}, ${veil(58)}`,
      opaqueFallback: `${HERO_TINT}, ${veil(88)}`,
    }),
    padding: tokens.spacing.md,
    [FROM_MEDIUM]: { padding: tokens.spacing.xl },
  },
  section: {
    ...frosted({
      radius: tokens.radius.lg,
      blur: PANEL_BLUR,
      background: veil(72),
      opaqueFallback: veil(92),
    }),
    padding: tokens.spacing.sm,
    [FROM_MEDIUM]: { padding: tokens.spacing.md },
  },
  dock: {
    ...frosted({
      radius: tokens.radius.xl,
      blur: PANEL_BLUR,
      background: veil(90),
      opaqueFallback: veil(100),
    }),
    paddingInline: tokens.spacing.xs,
    paddingBlock: tokens.spacing["3xs"],
  },
};
