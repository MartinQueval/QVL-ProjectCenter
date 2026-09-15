import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import { frostedPanelSx, type FrostedPanelEmphasis } from "./frostedPanelSx";

export interface FrostedPanelProps {
  emphasis?: FrostedPanelEmphasis;
  children: ReactNode;
}

export function FrostedPanel({ emphasis = "section", children }: FrostedPanelProps) {
  return <Box sx={frostedPanelSx[emphasis]}>{children}</Box>;
}
