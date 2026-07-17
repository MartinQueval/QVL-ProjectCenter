import { useMemo } from "react";
import type { Project, Section } from "../data/types";
import { SECTIONS, getSectionHomeProjects } from "../data/projects";

export interface HomeSectionData {
  section: Section;
  projects: Project[];
}

export function useHomePage(): HomeSectionData[] {
  return useMemo(
    () =>
      SECTIONS.map((section) => ({
        section,
        projects: getSectionHomeProjects(section.slug),
      })),
    [],
  );
}
