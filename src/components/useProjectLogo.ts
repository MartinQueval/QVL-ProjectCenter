import { useCallback, useMemo, useState } from "react";

export interface MonogramTone {
  background: string;
  color: string;
}

export interface UseProjectLogoParams {
  id: string;
  name: string;
  iconSrc?: string;
}

export interface UseProjectLogoResult {
  showIcon: boolean;
  iconUrl?: string;
  monogram: string;
  tone: MonogramTone;
  onIconError: () => void;
}

const MONOGRAM_TONES = [
  {
    background: "var(--canop-palette-primary-main)",
    color: "var(--canop-palette-primary-contrastText)",
  },
  {
    background: "var(--canop-palette-secondary-main)",
    color: "var(--canop-palette-secondary-contrastText)",
  },
  {
    background: "var(--canop-palette-accent-main)",
    color: "var(--canop-palette-accent-contrastText)",
  },
  {
    background: "var(--canop-palette-info-main)",
    color: "var(--canop-palette-info-contrastText)",
  },
] as const;

const FNV_OFFSET_BASIS = 0x811c9dc5;
const FNV_PRIME = 0x01000193;

export function toInitials(name: string): string {
  const label = name.replace(/^QVL[-_\s]*/i, "").trim() || name;
  const capitals = label.replace(/[^A-Z]/g, "");
  const source = capitals.length >= 2 ? capitals : label.replace(/[^A-Za-z0-9]/g, "");
  return source.slice(0, 2).toUpperCase();
}

export function monogramTone(id: string): MonogramTone {
  let hash = FNV_OFFSET_BASIS;
  for (let index = 0; index < id.length; index += 1) {
    hash = Math.imul(hash ^ id.charCodeAt(index), FNV_PRIME) >>> 0;
  }
  return MONOGRAM_TONES[hash % MONOGRAM_TONES.length] ?? MONOGRAM_TONES[0];
}

export function useProjectLogo({ id, name, iconSrc }: UseProjectLogoParams): UseProjectLogoResult {
  const [iconFailed, setIconFailed] = useState(false);
  const monogram = useMemo(() => toInitials(name), [name]);
  const tone = useMemo(() => monogramTone(id), [id]);
  const onIconError = useCallback(() => setIconFailed(true), []);

  return {
    showIcon: iconSrc !== undefined && !iconFailed,
    iconUrl: iconSrc,
    monogram,
    tone,
    onIconError,
  };
}
