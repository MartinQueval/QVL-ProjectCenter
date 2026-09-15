import { Card, Heading, Icon, Stack, Text } from "canopui";
import type { Project } from "../data/types";
import { useDocProjectCard } from "./useDocProjectCard";

export interface DocProjectCardProps {
  project: Project;
}

export function DocProjectCard({ project }: DocProjectCardProps) {
  const openDoc = useDocProjectCard(project.id);

  return (
    <Card
      variant="interactive"
      elevation="sm"
      fill
      onClick={openDoc}
      ariaLabel={`Documentation de ${project.name}`}
    >
      <Stack gap="sm" justifyContent="space-between" fill>
        <Stack gap="xs">
          <Heading level={3} size={5} gutterBottom={false}>
            {project.name}
          </Heading>
          <Text variant="body-sm" tone="secondary">
            {project.description}
          </Text>
        </Stack>
        <Stack direction="row" gap="xs" alignItems="center">
          <Text variant="label" tone="primary">
            Lire la documentation
          </Text>
          <Icon name="arrowRight" size="sm" color="primary" />
        </Stack>
      </Stack>
    </Card>
  );
}
