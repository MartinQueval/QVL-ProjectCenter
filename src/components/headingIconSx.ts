import type { SxProps, Theme } from "@mui/material/styles";
import {
  tokens,
  type CanopBreakpoint,
  type CanopHeadingSize,
  type CanopResponsiveHeadingSize,
} from "canopui";

const { heading } = tokens.typography;

const HEADING_FONT_SIZE: Record<CanopHeadingSize, string> = {
  1: heading.h1.fontSize,
  2: heading.h2.fontSize,
  3: heading.h3.fontSize,
  4: heading.h4.fontSize,
  5: heading.h5.fontSize,
  6: heading.h6.fontSize,
};

const BREAKPOINTS = ["xs", "sm", "md", "lg"] as const satisfies readonly CanopBreakpoint[];

type ResponsiveFontSize = string | Partial<Record<CanopBreakpoint, string>>;

function headingFontSize(size: CanopHeadingSize | CanopResponsiveHeadingSize): ResponsiveFontSize {
  if (typeof size === "number") {
    return HEADING_FONT_SIZE[size];
  }

  const fontSizes: Partial<Record<CanopBreakpoint, string>> = {};

  BREAKPOINTS.forEach((breakpoint) => {
    const step = size[breakpoint];

    if (step !== undefined) {
      fontSizes[breakpoint] = HEADING_FONT_SIZE[step];
    }
  });

  return fontSizes;
}

export function headingIconSx(
  size: CanopHeadingSize | CanopResponsiveHeadingSize,
): SxProps<Theme> {
  const fontSize = headingFontSize(size);

  return {
    display: "flex",
    alignItems: "center",
    flexShrink: 0,
    "& svg": { width: fontSize, height: fontSize },
  };
}
