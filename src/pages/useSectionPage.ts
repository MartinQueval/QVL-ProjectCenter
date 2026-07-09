import { useParams } from "react-router-dom";
import type { Project, Section } from "../data/types";
import { getSection, getSectionProjects } from "../data/projects";

export interface UseSectionPageResult {
  section: Section;
  projects: Project[];
  notFound: false;
}

export interface UseSectionPageNotFound {
  notFound: true;
}

export function useSectionPage(): UseSectionPageResult | UseSectionPageNotFound {
  const { section: slug } = useParams();
  const section = slug ? getSection(slug) : undefined;

  if (!section) {
    return { notFound: true };
  }

  return { section, projects: getSectionProjects(section.slug), notFound: false };
}
