export function useDocSearchSummary(count: number, query: string): string {
  const plural = count > 1 ? "s" : "";
  const trimmed = query.trim();

  if (trimmed.length === 0) {
    return `${count} projet${plural} documenté${plural}`;
  }

  return `${count} résultat${plural} pour « ${trimmed} »`;
}
