import type { CSSProperties, ReactNode } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Card, Heading, Link, Stack, StatusChip, Text } from "canopui";
import type { Project } from "../data/types";
import { ProjectLogo } from "./ProjectLogo";
import { StoreAppCardActions } from "./StoreAppCardActions";
import { useStoreAppCard } from "./useStoreAppCard";

export interface StoreAppCardProps {
  project: Project;
  actions?: ReactNode;
}

const titleColor = "var(--canop-palette-primary-main)";

const taglineStyle: CSSProperties = {
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
  overflow: "hidden",
};

export function StoreAppCard({ project, actions }: StoreAppCardProps) {
  const { docHref, status, canOpenApp, openApp, openDoc } = useStoreAppCard(project);

  return (
    <Card
      elevation="sm"
      fill
      actions={
        <StoreAppCardActions
          name={project.name}
          canOpenApp={canOpenApp}
          onOpenApp={openApp}
          onOpenDoc={openDoc}
          actions={actions}
        />
      }
    >
      <Stack gap="sm" fill>
        <Link component={RouterLink} to={docHref} color="primary">
          <Stack direction="row" gap="sm" alignItems="center">
            <ProjectLogo id={project.id} name={project.name} iconSrc={project.iconSrc} />
            <Heading level={3} size={5} gutterBottom={false} color={titleColor}>
              {project.name}
            </Heading>
          </Stack>
        </Link>
        {status ? (
          <Stack direction="row" gap="xs" alignItems="center">
            <StatusChip tone={status.tone} label={status.label} size="small" />
          </Stack>
        ) : null}
        {project.tagline ? (
          <span style={taglineStyle}>
            <Text as="span" variant="body-sm" tone="muted">
              {project.tagline}
            </Text>
          </span>
        ) : null}
      </Stack>
    </Card>
  );
}
