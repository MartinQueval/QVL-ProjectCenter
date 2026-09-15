import { useMemo, useState } from "react";
import { foldForSearch, useTranslation } from "canopui";
import type { Project, Section } from "../data/types";
import { getDocProjects, getStoreSections } from "../data/projects";
import { projectMatchesSearch } from "../lib/projectSearch";

export interface DocSectionGroup {
  section: Section;
  projects: Project[];
}

export interface UseDocIndexPageResult {
  query: string;
  setQuery: (value: string) => void;
  groups: DocSectionGroup[];
  hasResults: boolean;
  resultCount: number;
}

export function useDocIndexPage(): UseDocIndexPageResult {
  const [query, setQuery] = useState("");
  const { t } = useTranslation();

  const groups = useMemo(() => {
    const needle = foldForSearch(query);
    const documented = getDocProjects().filter(
      (project) => needle.length === 0 || projectMatchesSearch(t, project, needle),
    );

    return getStoreSections()
      .map((section) => ({
        section,
        projects: documented.filter((project) => project.section === section.slug),
      }))
      .filter((group) => group.projects.length > 0);
  }, [query, t]);

  const resultCount = useMemo(
    () => groups.reduce((total, group) => total + group.projects.length, 0),
    [groups],
  );

  return { query, setQuery, groups, hasResults: groups.length > 0, resultCount };
}
