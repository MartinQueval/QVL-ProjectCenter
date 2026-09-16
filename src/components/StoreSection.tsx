import { Heading, Stack, Text, useTranslation, type CanopResponsiveHeadingSize } from "canopui";
import type { Project, Section } from "../data/types";
import { FrostedPanel } from "./FrostedPanel";
import { HeadingIcon } from "./HeadingIcon";
import { StoreSectionApps } from "./StoreSectionApps";
import { useStoreSection } from "./useStoreSection";

export interface StoreSectionProps {
  section: Section;
  projects: Project[];
}

const SECTION_HEADING_SIZE: CanopResponsiveHeadingSize = { xs: 5, md: 4 };

export function StoreSection({ section, projects }: StoreSectionProps) {
  const { compact, tagline, appsLabel } = useStoreSection(section);
  const { t } = useTranslation();
  const isEmpty = projects.length === 0;

  return (
    <Stack as="section" gap="md" ariaLabel={section.label}>
      <FrostedPanel>
        <Stack gap="xs">
          <Stack direction="row" gap="xs" alignItems="center">
            {section.icon ? (
              <HeadingIcon name={section.icon} size={SECTION_HEADING_SIZE} color="primary" />
            ) : null}
            <Heading level={2} size={SECTION_HEADING_SIZE} gutterBottom={false}>
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
