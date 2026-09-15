import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { CanopStatusTone } from "canopui";
import type { Project, ProjectStatus } from "../data/types";
import { DOC_PATH } from "../hooks/useAppNavigation";

export interface StoreAppStatus {
  tone: CanopStatusTone;
  label: string;
}

export interface UseStoreAppCardResult {
  docHref: string;
  status?: StoreAppStatus;
  canOpenApp: boolean;
  openApp: () => void;
  openDoc: () => void;
}

const STATUS_PRESENTATION: Record<ProjectStatus, StoreAppStatus> = {
  live: { tone: "success", label: "En ligne" },
  beta: { tone: "warning", label: "Bêta" },
  interne: { tone: "neutral", label: "Interne" },
};

export function useStoreAppCard(project: Project): UseStoreAppCardResult {
  const navigate = useNavigate();
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
    status: status ? STATUS_PRESENTATION[status] : undefined,
    canOpenApp: url !== undefined,
    openApp,
    openDoc,
  };
}
