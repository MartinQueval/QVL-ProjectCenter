import { CardGrid, Feedback, Heading, Stack } from "canopui";
import type { Project, Section } from "../data/types";
import { ProjectCard } from "./ProjectCard";

export interface HomeSectionProps {
  section: Section;
  projects: Project[];
}

export function HomeSection({ section, projects }: HomeSectionProps) {
  return (
    <Stack gap="sm" as="section" label={section.label}>
      <Heading level={2} size={4}>
        {section.label}
      </Heading>
      {projects.length === 0 ? (
        <Feedback severity="info">Aucun projet dans cette section pour le moment.</Feedback>
      ) : (
        <CardGrid minItemWidth="16rem">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </CardGrid>
      )}
    </Stack>
  );
}
