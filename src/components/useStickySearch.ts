import type { CSSProperties } from "react";
import { tokens, useBreakpointDown, type CanopStackProps } from "canopui";

export interface UseStickySearchResult {
  sticky: CanopStackProps["sticky"];
  dockStyle: CSSProperties;
}

const FLOWING_DOCK: CSSProperties = {
  borderRadius: "var(--canop-radius-xl)",
};

const PINNED_DOCK: CSSProperties = {
  ...FLOWING_DOCK,
  paddingInline: tokens.spacing.xs,
  paddingBlock: tokens.spacing["3xs"],
  backgroundColor: "var(--canop-palette-surface-base)",
  boxShadow: "var(--canop-shadow-e2)",
};

export function useStickySearch(): UseStickySearchResult {
  const compact = useBreakpointDown("md");

  return {
    sticky: compact ? "top" : undefined,
    dockStyle: compact ? PINNED_DOCK : FLOWING_DOCK,
  };
}
