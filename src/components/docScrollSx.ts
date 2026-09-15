import type { CSSObject } from "@mui/material/styles";
import { scrollbarSx } from "canopui";

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
