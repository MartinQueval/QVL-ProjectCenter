import { useParams } from "react-router-dom";
import type { Project } from "../data/types";
import { getProject } from "../data/projects";

export interface UseProjectDocPageResult {
  project: Project | undefined;
}

export function useProjectDocPage(): UseProjectDocPageResult {
  const { section: slug, project: id } = useParams();
  const project = slug && id ? getProject(slug, id) : undefined;

  return { project };
}
