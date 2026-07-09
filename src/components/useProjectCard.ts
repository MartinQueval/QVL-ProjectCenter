import { useMemo, useState } from "react";

export interface ProjectCardInteractionHandlers {
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onFocus: () => void;
  onBlur: () => void;
}

export interface UseProjectCardResult {
  isRaised: boolean;
  interactionHandlers: ProjectCardInteractionHandlers;
}

export function useProjectCard(): UseProjectCardResult {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  const interactionHandlers = useMemo<ProjectCardInteractionHandlers>(
    () => ({
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
      onFocus: () => setFocused(true),
      onBlur: () => setFocused(false),
    }),
    [],
  );

  return { isRaised: hovered || focused, interactionHandlers };
}
