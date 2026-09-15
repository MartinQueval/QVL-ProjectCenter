import { useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation, type CanopNavbarItem } from "canopui";

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
  const { t } = useTranslation();

  const items = useMemo<CanopNavbarItem[]>(
    () => [
      { label: t("nav.store"), icon: "apps", href: STORE_PATH },
      { label: t("nav.doc"), icon: "book", href: DOC_PATH },
    ],
    [t],
  );

  const onNavigate = useCallback((href: string) => navigate(href), [navigate]);

  return { items, activeHref: location.pathname, onNavigate };
}
