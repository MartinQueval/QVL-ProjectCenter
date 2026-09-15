import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "canopui";
import type { Project } from "../data/types";
import { DOC_PATH } from "../hooks/useAppNavigation";
import { projectText } from "../i18n/projectText";

export interface UseDocProjectCardResult {
  description: string;
  cardLabel: string;
  readLabel: string;
  openDoc: () => void;
}

export function useDocProjectCard(project: Project): UseDocProjectCardResult {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id, name } = project;

  const openDoc = useCallback(() => navigate(`${DOC_PATH}/${id}`), [navigate, id]);

  return {
    description: projectText(t, project).description,
    cardLabel: t("doc.card.label", { name }),
    readLabel: t("doc.card.read"),
    openDoc,
  };
}
