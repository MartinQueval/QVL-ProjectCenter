import { Feedback, Heading, Stack } from "canopui";
import type { Project, Section } from "../data/types";
import { SectionRow } from "./SectionRow";

export interface HomeSectionProps {
  section: Section;
  projects: Project[];
}

export function HomeSection({ section, projects }: HomeSectionProps) {
  return (
    <Stack gap="sm" as="section" label={section.label}>
      <Heading level={3} size={5}>
        {section.label}
      </Heading>
      {projects.length === 0 ? (
        <Feedback severity="info">Aucun projet dans cette section pour le moment.</Feedback>
      ) : (
        <SectionRow projects={projects} />
      )}
    </Stack>
  );
}
