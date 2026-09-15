import type { CSSObject } from "@mui/material/styles";
import { useReducedMotion } from "canopui";

export interface UseStoreIconActionResult {
  animated: boolean;
  wrapperSx: CSSObject;
}

const INLINE_SX: CSSObject = { display: "inline-flex" };

const ACCENT_SX: CSSObject = {
  ...INLINE_SX,
  "& .MuiIconButton-root": { color: "var(--canop-palette-accent-contrastText)" },
  "& .MuiIconButton-root::before": {
    backgroundColor: "var(--canop-palette-accent-main)",
  },
  "& .MuiIconButton-root:hover::before": {
    backgroundColor: "var(--canop-palette-accent-dark)",
  },
};

export function useStoreIconAction(accent: boolean): UseStoreIconActionResult {
  return { animated: !useReducedMotion(), wrapperSx: accent ? ACCENT_SX : INLINE_SX };
}
