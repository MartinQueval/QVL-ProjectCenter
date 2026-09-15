import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useBreakpointDown } from "canopui";
import type { ProjectDocErrorKind } from "../hooks/useProjectDoc";
import { DOC_PATH } from "../hooks/useAppNavigation";

export interface UseDocLoadErrorResult {
  title: string;
  description: string;
  isCompact: boolean;
  backToIndex: () => void;
}

const MESSAGES: Record<ProjectDocErrorKind, { title: string; description: string }> = {
  notFound: {
    title: "Documentation introuvable",
    description:
      "Le fichier de documentation de ce projet n'existe pas encore dans le dépôt, ou il a été déplacé.",
  },
  network: {
    title: "Documentation indisponible",
    description:
      "La documentation n'a pas pu être chargée depuis GitLab. Vérifiez votre connexion, puis réessayez.",
  },
};

export function useDocLoadError(kind: ProjectDocErrorKind): UseDocLoadErrorResult {
  const navigate = useNavigate();
  const isCompact = useBreakpointDown("md");
  const backToIndex = useCallback(() => navigate(DOC_PATH), [navigate]);

  return { ...MESSAGES[kind], isCompact, backToIndex };
}
