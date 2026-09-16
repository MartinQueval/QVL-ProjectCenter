import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useBreakpointDown, useTranslation } from "canopui";
import { STORE_PATH } from "./useAppNavigation";

export interface UsePageHeaderResult {
  title?: string;
  subtitle?: string;
}

export function usePageHeader(): UsePageHeaderResult {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const compact = useBreakpointDown("sm");

  return useMemo(() => {
    if (pathname !== STORE_PATH) {
      return {};
    }

    return compact
      ? { title: t("store.title") }
      : { title: t("store.title"), subtitle: t("store.subtitle") };
  }, [compact, pathname, t]);
}
