import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import { tokens, useTranslation } from "canopui";
import { docScrollSx } from "./docScrollSx";

export interface DocCodeBlockProps {
  children?: ReactNode;
}

export function DocCodeBlock({ children }: DocCodeBlockProps) {
  const { t } = useTranslation();

  return (
    <Box
      component="pre"
      role="group"
      tabIndex={0}
      aria-label={t("doc.markdown.codeBlock")}
      sx={{
        ...docScrollSx(),
        margin: `0 0 ${tokens.spacing.md} 0`,
        padding: tokens.spacing.md,
        backgroundColor: "var(--canop-palette-secondary-light)",
        borderRadius: tokens.radius.md,
      }}
    >
      {children}
    </Box>
  );
}
