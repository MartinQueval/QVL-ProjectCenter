import { Heading, Stack, Text, useTranslation } from "canopui";
import type { DocSectionGroup } from "../pages/useDocIndexPage";
import { sectionText } from "../i18n/sectionText";
import { DocProjectGrid } from "./DocProjectGrid";

export interface DocSectionGroupBlockProps {
  group: DocSectionGroup;
}

export function DocSectionGroupBlock({ group }: DocSectionGroupBlockProps) {
  const { section, projects } = group;
  const { t } = useTranslation();
  const { tagline } = sectionText(t, section);

  return (
    <Stack gap="sm" as="section" ariaLabel={section.label}>
      <Stack gap="xs">
        <Heading level={2} size={{ xs: 5, md: 4 }} gutterBottom={false}>
          {section.label}
        </Heading>
        {tagline ? (
          <Text variant="body-sm" tone="muted">
            {tagline}
          </Text>
        ) : null}
      </Stack>
      <DocProjectGrid projects={projects} />
    </Stack>
  );
}
