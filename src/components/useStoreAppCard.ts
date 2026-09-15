import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation, type CanopStatusTone } from "canopui";
import type { Project, ProjectStatus } from "../data/types";
import { DOC_PATH } from "../hooks/useAppNavigation";
import { projectText, type ProjectText } from "../i18n/projectText";

export interface StoreAppStatus {
  tone: CanopStatusTone;
  label: string;
}

export interface UseStoreAppCardResult {
  docHref: string;
  status?: StoreAppStatus;
  text: ProjectText;
  canOpenApp: boolean;
  openApp: () => void;
  openDoc: () => void;
}

const STATUS_TONES: Record<ProjectStatus, CanopStatusTone> = {
  live: "success",
  beta: "warning",
  interne: "neutral",
};

export function useStoreAppCard(project: Project): UseStoreAppCardResult {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id, url, status } = project;
  const docHref = `${DOC_PATH}/${id}`;

  const openDoc = useCallback(() => navigate(docHref), [navigate, docHref]);

  const openApp = useCallback(() => {
    if (!url) {
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  }, [url]);

  return {
    docHref,
    status: status ? { tone: STATUS_TONES[status], label: t(`status.${status}`) } : undefined,
    text: projectText(t, project),
    canOpenApp: url !== undefined,
    openApp,
    openDoc,
  };
}
