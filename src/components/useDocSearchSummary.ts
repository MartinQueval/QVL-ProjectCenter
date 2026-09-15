import { useTranslation } from "canopui";

export function useDocSearchSummary(count: number, query: string): string {
  const { t } = useTranslation();
  const trimmed = query.trim();

  if (trimmed.length === 0) {
    return t("doc.search.documented", { count });
  }

  return t("doc.search.results", { count, query: trimmed });
}
