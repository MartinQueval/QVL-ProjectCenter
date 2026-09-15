import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { DOC_PATH } from "../hooks/useAppNavigation";

export function useDocProjectCard(id: string): () => void {
  const navigate = useNavigate();

  return useCallback(() => navigate(`${DOC_PATH}/${id}`), [navigate, id]);
}
