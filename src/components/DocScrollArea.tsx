import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import { tokens } from "canopui";
import { docScrollSx } from "./docScrollSx";

export interface DocScrollAreaProps {
  label: string;
  children: ReactNode;
}

export function DocScrollArea({ label, children }: DocScrollAreaProps) {
  return (
    <Box
      role="group"
      tabIndex={0}
      aria-label={label}
      sx={{ ...docScrollSx(), marginBottom: tokens.spacing.md }}
    >
      {children}
    </Box>
  );
}
