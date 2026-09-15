import { useBreakpointDown, useReducedMotion } from "canopui";
import type { ProjectLogoSize } from "./ProjectLogo";

export interface UseStoreHeroTileResult {
  animated: boolean;
  logoSize: ProjectLogoSize;
}

export function useStoreHeroTile(): UseStoreHeroTileResult {
  const compact = useBreakpointDown("sm");
  const reducedMotion = useReducedMotion();

  return { animated: !reducedMotion, logoSize: compact ? "md" : "lg" };
}
