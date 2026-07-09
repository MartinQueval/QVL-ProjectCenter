import { useCallback, useMemo, useState } from "react";

export interface UseProjectLogoResult {
  showFallback: boolean;
  initials: string;
  onImageError: () => void;
}

function toInitials(name: string): string {
  const capitals = name.replace(/[^A-Z]/g, "");
  const source = capitals.length >= 2 ? capitals : name;
  return source.slice(0, 2).toUpperCase();
}

export function useProjectLogo(name: string, logo: string): UseProjectLogoResult {
  const [failed, setFailed] = useState(false);
  const initials = useMemo(() => toInitials(name), [name]);
  const onImageError = useCallback(() => setFailed(true), []);

  return { showFallback: failed || logo.length === 0, initials, onImageError };
}
