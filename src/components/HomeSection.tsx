import { CardGrid, Feedback, Heading, Stack } from "canopui";
import type { Project, Section } from "../data/types";
import { ProjectCard } from "./ProjectCard";

export interface HomeSectionProps {
  section: Section;
  projects: Project[];
}

export function HomeSection({ section, projects }: HomeSectionProps) {
  return (
    <Stack gap="sm" as="section" ariaLabel={section.label}>
      <Heading level={2} size={{ xs: 5, md: 4 }}>
        {section.label}
      </Heading>
      {projects.length === 0 ? (
        <Feedback severity="info">Aucun projet dans cette section pour le moment.</Feedback>
      ) : (
        <CardGrid minItemWidth="16rem" columns={{ sm: 2, lg: 4 }}>
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </CardGrid>
      )}
    </Stack>
  );
}
