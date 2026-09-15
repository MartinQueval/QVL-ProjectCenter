import { Heading, Icon, Stack, Text, useTranslation } from "canopui";
import type { Project, Section } from "../data/types";
import { FrostedPanel } from "./FrostedPanel";
import { StoreSectionApps } from "./StoreSectionApps";
import { useStoreSection } from "./useStoreSection";

export interface StoreSectionProps {
  section: Section;
  projects: Project[];
}

export function StoreSection({ section, projects }: StoreSectionProps) {
  const { compact, tagline, appsLabel } = useStoreSection(section);
  const { t } = useTranslation();
  const isEmpty = projects.length === 0;

  return (
    <Stack as="section" gap="md" ariaLabel={section.label}>
      <FrostedPanel>
        <Stack gap="xs">
          <Stack direction="row" gap="xs" alignItems="center">
            {section.icon ? <Icon name={section.icon} size="sm" color="primary" /> : null}
            <Heading level={2} size={{ xs: 5, md: 4 }} gutterBottom={false}>
              {section.label}
            </Heading>
          </Stack>
          {tagline ? (
            <Text variant="body-sm" tone="muted">
              {tagline}
            </Text>
          ) : null}
          {isEmpty ? (
            <Text variant="body-sm" tone="muted">
              {t("store.section.empty")}
            </Text>
          ) : null}
        </Stack>
      </FrostedPanel>
      {isEmpty ? null : (
        <StoreSectionApps projects={projects} ariaLabel={appsLabel} compact={compact} />
      )}
    </Stack>
  );
}
