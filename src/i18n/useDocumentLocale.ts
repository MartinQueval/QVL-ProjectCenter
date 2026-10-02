import { useEffect } from "react";
import { useTranslation } from "@canop/ui";

export function useDocumentLocale(): void {
  const { locale } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
}
