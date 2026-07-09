import { useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { ChNavbarItem } from "canopui";
import { SECTIONS, getSectionProjects } from "../data/projects";

export interface UseAppNavigationResult {
  items: ChNavbarItem[];
  activeHref: string;
  onNavigate: (href: string) => void;
}

export function useAppNavigation(): UseAppNavigationResult {
  const navigate = useNavigate();
  const location = useLocation();

  const items = useMemo<ChNavbarItem[]>(
    () =>
      SECTIONS.map((section) => ({
        label: section.label,
        icon: section.icon,
        href: `/${section.slug}`,
        children: getSectionProjects(section.slug).map((project) => ({
          label: project.name,
          href: `/${section.slug}/${project.id}`,
        })),
      })),
    [],
  );

  const onNavigate = useCallback((href: string) => navigate(href), [navigate]);

  return { items, activeHref: location.pathname, onNavigate };
}
