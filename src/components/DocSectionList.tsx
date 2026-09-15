import { Heading, Stack, Text } from "canopui";
import type { DocSectionGroup } from "../pages/useDocIndexPage";
import { DocProjectGrid } from "./DocProjectGrid";

export interface DocSectionListProps {
  groups: DocSectionGroup[];
}

export function DocSectionList({ groups }: DocSectionListProps) {
  return (
    <Stack gap="xl">
      {groups.map(({ section, projects }) => (
        <Stack key={section.slug} gap="sm" as="section" ariaLabel={section.label}>
          <Stack gap="xs">
            <Heading level={2} size={{ xs: 5, md: 4 }} gutterBottom={false}>
              {section.label}
            </Heading>
            {section.tagline ? (
              <Text variant="body-sm" tone="muted">
                {section.tagline}
              </Text>
            ) : null}
          </Stack>
          <DocProjectGrid projects={projects} />
        </Stack>
      ))}
    </Stack>
  );
}
