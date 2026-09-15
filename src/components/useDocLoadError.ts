import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useBreakpointDown, useTranslation } from "canopui";
import type { ProjectDocErrorKind } from "../hooks/useProjectDoc";
import { DOC_PATH } from "../hooks/useAppNavigation";

export interface UseDocLoadErrorResult {
  title: string;
  description: string;
  retryLabel: string;
  backLabel: string;
  isCompact: boolean;
  backToIndex: () => void;
}

export function useDocLoadError(kind: ProjectDocErrorKind): UseDocLoadErrorResult {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isCompact = useBreakpointDown("md");
  const backToIndex = useCallback(() => navigate(DOC_PATH), [navigate]);

  return {
    title: t(`doc.error.${kind}.title`),
    description: t(`doc.error.${kind}.description`),
    retryLabel: t("doc.error.retry"),
    backLabel: t("doc.error.back"),
    isCompact,
    backToIndex,
  };
}
