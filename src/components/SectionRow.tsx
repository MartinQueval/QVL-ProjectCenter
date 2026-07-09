import { Stack } from "canopui";
import type { Project } from "../data/types";
import { ProjectCard } from "./ProjectCard";

export interface SectionRowProps {
  projects: Project[];
}

export function SectionRow({ projects }: SectionRowProps) {
  return (
    <Stack direction="row" gap="md" wrap alignItems="stretch">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </Stack>
  );
}
