import { useCallback, useMemo, useState } from "react";
import { buildGitlabRawUrl } from "../lib/gitlabDocs";

export interface UseProjectLogoResult {
  showFallback: boolean;
  initials: string;
  imageUrl?: string;
  onImageError: () => void;
}

export function toInitials(name: string): string {
  const label = name.replace(/^QVL[-_\s]*/i, "").trim() || name;
  const capitals = label.replace(/[^A-Z]/g, "");
  const source = capitals.length >= 2 ? capitals : label.replace(/[^A-Za-z0-9]/g, "");
  return source.slice(0, 2).toUpperCase();
}

export function useProjectLogo(name: string, logo?: string): UseProjectLogoResult {
  const [failed, setFailed] = useState(false);
  const initials = useMemo(() => toInitials(name), [name]);
  const imageUrl = useMemo(
    () => (logo && logo.length > 0 ? buildGitlabRawUrl(logo) : undefined),
    [logo],
  );
  const onImageError = useCallback(() => setFailed(true), []);

  return { showFallback: failed || imageUrl === undefined, initials, imageUrl, onImageError };
}
