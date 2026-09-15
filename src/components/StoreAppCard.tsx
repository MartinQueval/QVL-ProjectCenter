import type { CSSProperties, ReactNode } from "react";
import { Card, Stack, StatusChip, Text } from "canopui";
import type { Project } from "../data/types";
import { StoreAppCardActions } from "./StoreAppCardActions";
import { StoreCardTitle } from "./StoreCardTitle";
import { useStoreAppCard } from "./useStoreAppCard";

export interface StoreAppCardProps {
  project: Project;
  actions?: ReactNode;
}

const taglineStyle: CSSProperties = {
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
  overflow: "hidden",
};

export function StoreAppCard({ project, actions }: StoreAppCardProps) {
  const { docHref, status, text, canOpenApp, openApp, openDoc } = useStoreAppCard(project);

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
        <StoreCardTitle project={project} docHref={docHref} size={5} />
        {status ? (
          <Stack direction="row" gap="xs" alignItems="center">
            <StatusChip tone={status.tone} label={status.label} size="small" />
          </Stack>
        ) : null}
        {text.tagline ? (
          <span style={taglineStyle}>
            <Text as="span" variant="body-sm" tone="muted">
              {text.tagline}
            </Text>
          </span>
        ) : null}
      </Stack>
    </Card>
  );
}
