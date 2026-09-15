import { Heading, Icon, Stack, Text, type CanopCardGridProps } from "canopui";
import type { Project, Section } from "../data/types";
import { ProjectCardGrid } from "./ProjectCardGrid";
import { StoreAppCard } from "./StoreAppCard";
import { StoreShortcutAction } from "./StoreShortcutAction";

export interface StoreSectionProps {
  section: Section;
  projects: Project[];
}

const SECTION_COLUMNS: CanopCardGridProps["columns"] = { xs: 1, sm: 2, md: 3 };

const EMPTY_MESSAGE = "Aucune application publiée dans cette catégorie pour le moment.";

function renderStoreAppCard(project: Project) {
  return <StoreAppCard project={project} actions={<StoreShortcutAction project={project} />} />;
}

export function StoreSection({ section, projects }: StoreSectionProps) {
  return (
    <Stack as="section" gap="md" ariaLabel={section.label}>
      <Stack gap="xs">
        <Stack direction="row" gap="xs" alignItems="center">
          {section.icon ? <Icon name={section.icon} size="sm" color="primary" /> : null}
          <Heading level={2} size={{ xs: 5, md: 4 }} gutterBottom={false}>
            {section.label}
          </Heading>
        </Stack>
        {section.tagline ? (
          <Text variant="body-sm" tone="secondary">
            {section.tagline}
          </Text>
        ) : null}
      </Stack>
      {projects.length === 0 ? (
        <Text variant="body-sm" tone="secondary">
          {EMPTY_MESSAGE}
        </Text>
      ) : (
        <ProjectCardGrid
          projects={projects}
          columns={SECTION_COLUMNS}
          renderCard={renderStoreAppCard}
        />
      )}
    </Stack>
  );
}
