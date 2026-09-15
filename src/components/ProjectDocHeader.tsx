import { Button, Heading, Icon, Stack, Text, useTranslation } from "canopui";
import type { Project } from "../data/types";
import { VisuallyHidden } from "./VisuallyHidden";
import { useProjectDocHeader } from "./useProjectDocHeader";

export interface ProjectDocHeaderProps {
  project: Project;
}

export function ProjectDocHeader({ project }: ProjectDocHeaderProps) {
  const { subtitle, canOpenApp, isCompact, openApp } = useProjectDocHeader(project);
  const { t } = useTranslation();

  return (
    <Stack
      direction={isCompact ? "column" : "row"}
      gap="md"
      alignItems={isCompact ? "stretch" : "end"}
      justifyContent="space-between"
    >
      <Stack gap="xs" fill>
        <Heading level={1} size={{ xs: 5, md: 3 }} gutterBottom={false}>
          {project.name}
        </Heading>
        <Text variant="body-md" tone="muted">
          {subtitle}
        </Text>
      </Stack>
      {canOpenApp ? (
        <Button
          variant="primary"
          onClick={openApp}
          startIcon={<Icon name="globe" size="sm" color="inherit" />}
        >
          {t("doc.header.open")}
          <VisuallyHidden>
            {` ${t("doc.header.openSuffix", { name: project.name })}`}
          </VisuallyHidden>
        </Button>
      ) : null}
    </Stack>
  );
}
