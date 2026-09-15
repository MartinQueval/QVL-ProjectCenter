import type { Project } from "../data/types";
import { DocProjectCard } from "./DocProjectCard";
import { ProjectCardGrid } from "./ProjectCardGrid";

export interface DocProjectGridProps {
  projects: Project[];
}

export function DocProjectGrid({ projects }: DocProjectGridProps) {
  return (
    <ProjectCardGrid
      projects={projects}
      renderCard={(project) => <DocProjectCard project={project} />}
    />
  );
}
