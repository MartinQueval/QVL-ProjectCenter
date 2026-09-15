import { useCallback } from "react";
import { useBreakpointDown, useTranslation } from "canopui";
import type { Project } from "../data/types";
import { projectText } from "../i18n/projectText";

export interface UseProjectDocHeaderResult {
  subtitle: string;
  canOpenApp: boolean;
  isCompact: boolean;
  openApp: () => void;
}

export function useProjectDocHeader(project: Project): UseProjectDocHeaderResult {
  const { url } = project;
  const { t } = useTranslation();
  const isCompact = useBreakpointDown("md");
  const { tagline, description } = projectText(t, project);

  const openApp = useCallback(() => {
    if (url === undefined) {
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  }, [url]);

  return {
    subtitle: tagline ?? description,
    canOpenApp: url !== undefined,
    isCompact,
    openApp,
  };
}
