import { useParams } from "react-router-dom";
import type { Project } from "../data/types";
import { getProject } from "../data/projects";

export interface UseProjectDocPageResult {
  project: Project;
  notFound: false;
}

export interface UseProjectDocPageNotFound {
  notFound: true;
}

export function useProjectDocPage(): UseProjectDocPageResult | UseProjectDocPageNotFound {
  const { projectId } = useParams();
  const project = projectId ? getProject(projectId) : undefined;

  if (!project) {
    return { notFound: true };
  }

  return { project, notFound: false };
}
