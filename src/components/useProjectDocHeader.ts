import { useCallback } from "react";
import { useBreakpointDown } from "canopui";
import type { Project } from "../data/types";

export interface UseProjectDocHeaderResult {
  subtitle: string;
  canOpenApp: boolean;
  isCompact: boolean;
  openApp: () => void;
}

export function useProjectDocHeader(project: Project): UseProjectDocHeaderResult {
  const { tagline, description, url } = project;
  const isCompact = useBreakpointDown("md");

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
