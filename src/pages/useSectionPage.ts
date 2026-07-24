import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import type { Project, Section } from "../data/types";
import { getSection, getSectionProjects } from "../data/projects";

export interface UseSectionPageResult {
  section: Section;
  query: string;
  setQuery: (value: string) => void;
  projects: Project[];
  hasProjects: boolean;
  notFound: false;
}

export interface UseSectionPageNotFound {
  notFound: true;
}

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

export function useSectionPage(): UseSectionPageResult | UseSectionPageNotFound {
  const { section: slug } = useParams();
  const [query, setQuery] = useState("");

  const section = slug ? getSection(slug) : undefined;
  const allProjects = useMemo(
    () => (section ? getSectionProjects(section.slug) : []),
    [section],
  );

  const projects = useMemo(() => {
    const needle = normalize(query.trim());
    if (!needle) {
      return allProjects;
    }
    return allProjects.filter((project) =>
      normalize(`${project.name} ${project.description}`).includes(needle),
    );
  }, [allProjects, query]);

  if (!section) {
    return { notFound: true };
  }

  return {
    section,
    query,
    setQuery,
    projects,
    hasProjects: allProjects.length > 0,
    notFound: false,
  };
}
