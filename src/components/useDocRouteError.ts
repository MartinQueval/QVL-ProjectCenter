import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useBreakpointDown } from "canopui";
import { STORE_PATH } from "../hooks/useAppNavigation";

export interface UseDocRouteErrorResult {
  isCompact: boolean;
  reload: () => void;
  backToStore: () => void;
}

export function useDocRouteError(): UseDocRouteErrorResult {
  const navigate = useNavigate();
  const isCompact = useBreakpointDown("md");
  const reload = useCallback(() => window.location.reload(), []);
  const backToStore = useCallback(() => navigate(STORE_PATH), [navigate]);

  return { isCompact, reload, backToStore };
}
