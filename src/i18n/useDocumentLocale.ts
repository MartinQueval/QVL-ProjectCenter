import { useEffect } from "react";
import { useTranslation } from "canopui";

export function useDocumentLocale(): void {
  const { locale } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
}
