import { useParams } from "react-router-dom";
import type { ProjectGroup, Section } from "../data/types";
import { getSection, getSectionTree } from "../data/projects";

export interface UseSectionPageResult {
  section: Section;
  groups: ProjectGroup[];
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

  return { section, groups: getSectionTree(section.slug), notFound: false };
}
