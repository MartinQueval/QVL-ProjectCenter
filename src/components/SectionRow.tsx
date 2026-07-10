import { Carousel } from "canopui";
import type { Project } from "../data/types";
import { ProjectCard } from "./ProjectCard";

export interface SectionRowProps {
  projects: Project[];
}

export function SectionRow({ projects }: SectionRowProps) {
  return (
    <Carousel label="Projets">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </Carousel>
  );
}
