import { useMemo, useState } from "react";
import { foldForSearch } from "canopui";
import type { Project, Section } from "../data/types";
import { getStoreApps, getStoreSections } from "../data/projects";
import { projectMatchesSearch } from "../lib/projectSearch";

export interface StoreSectionData {
  section: Section;
  projects: Project[];
}

export interface UseHomePageResult {
  query: string;
  onQueryChange: (value: string) => void;
  featured?: StoreSectionData;
  sections: StoreSectionData[];
  hasResults: boolean;
}

function matching(projects: Project[], needle: string): Project[] {
  return projects.filter((project) => projectMatchesSearch(project, needle));
}

export function useHomePage(): UseHomePageResult {
  const [query, setQuery] = useState("");
  const needle = foldForSearch(query);
  const isSearching = needle.length > 0;

  const storeSections = useMemo<StoreSectionData[]>(
    () =>
      getStoreSections().map((section) => ({
        section,
        projects: getStoreApps(section.slug),
      })),
    [],
  );

  const visibleSections = useMemo<StoreSectionData[]>(() => {
    if (!isSearching) {
      return storeSections;
    }
    return storeSections
      .map(({ section, projects }) => ({ section, projects: matching(projects, needle) }))
      .filter(({ projects }) => projects.length > 0);
  }, [storeSections, needle, isSearching]);

  const { featured, sections } = useMemo(
    () => ({
      featured: visibleSections.find(({ section }) => section.featured === true),
      sections: visibleSections.filter(({ section }) => section.featured !== true),
    }),
    [visibleSections],
  );

  return {
    query,
    onQueryChange: setQuery,
    featured,
    sections,
    hasResults: visibleSections.length > 0,
  };
}
