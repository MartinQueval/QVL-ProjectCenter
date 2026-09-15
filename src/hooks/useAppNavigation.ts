import { useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { CanopNavbarItem } from "canopui";

export const STORE_PATH = "/";
export const DOC_PATH = "/doc";

export interface UseAppNavigationResult {
  items: CanopNavbarItem[];
  activeHref: string;
  onNavigate: (href: string) => void;
}

export function useAppNavigation(): UseAppNavigationResult {
  const navigate = useNavigate();
  const location = useLocation();

  const items = useMemo<CanopNavbarItem[]>(
    () => [
      { label: "Store", icon: "apps", href: STORE_PATH },
      { label: "Documentation", icon: "book", href: DOC_PATH },
    ],
    [],
  );

  const onNavigate = useCallback((href: string) => navigate(href), [navigate]);

  return { items, activeHref: location.pathname, onNavigate };
}
