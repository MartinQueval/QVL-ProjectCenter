import type { CSSObject } from "@mui/material/styles";
import { scrollbarSx } from "@canop/ui";

export function docScrollSx(): CSSObject {
  return {
    maxWidth: "100%",
    overflowX: "auto",
    overscrollBehaviorX: "contain",
    ...scrollbarSx("thin"),
    "&:focus-visible": {
      outline: "0.125rem solid var(--canop-palette-primary-main)",
      outlineOffset: "0.125rem",
    },
  };
}
