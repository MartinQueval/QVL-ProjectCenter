import { useParams } from "react-router-dom";
import type { Project, Section } from "../data/types";
import { getSection, getSectionProjects } from "../data/projects";

export interface UseSectionPageResult {
  section: Section | undefined;
  projects: Project[];
}

export function useSectionPage(): UseSectionPageResult {
  const { section: slug } = useParams();
  const section = slug ? getSection(slug) : undefined;
  const projects = section ? getSectionProjects(section.slug) : [];

  return { section, projects };
}
