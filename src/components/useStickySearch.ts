import type { CSSObject } from "@mui/material/styles";
import { squircleSurface, useBreakpointDown, type CanopStackProps } from "canopui";
import { frostedPanelSx } from "./frostedPanelSx";

export interface UseStickySearchResult {
  sticky: CanopStackProps["sticky"];
  dockSx: CSSObject;
}

const FIELD_RADIUS = "1.375rem";
const FOCUS_RING_WIDTH = "0.125rem";

const SEARCH_FIELD_SX: CSSObject = {
  "& .MuiOutlinedInput-notchedOutline": { borderWidth: 0 },
  "& .MuiOutlinedInput-root.Mui-focused": squircleSurface({
    shape: "pill",
    radius: FIELD_RADIUS,
    background: "var(--canop-palette-surface-sunken)",
    borderColor: "var(--canop-palette-primary-main)",
    borderWidth: FOCUS_RING_WIDTH,
  }),
};

export function useStickySearch(): UseStickySearchResult {
  const compact = useBreakpointDown("md");

  return {
    sticky: compact ? "top" : undefined,
    dockSx: compact ? { ...frostedPanelSx.dock, ...SEARCH_FIELD_SX } : SEARCH_FIELD_SX,
  };
}
