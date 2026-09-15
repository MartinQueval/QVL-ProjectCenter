import type { CSSProperties } from "react";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Card,
  Heading,
  Link,
  Stack,
  StatusChip,
  Text,
  motionDurationSeconds,
  motionEasing,
  useReducedMotion,
} from "canopui";
import type { Project } from "../data/types";
import { ProjectLogo } from "./ProjectLogo";
import { StoreAppCardActions } from "./StoreAppCardActions";
import { StoreShortcutAction } from "./StoreShortcutAction";
import { useStoreAppCard } from "./useStoreAppCard";

export interface StoreHeroTileProps {
  project: Project;
}

const HOVER_LIFT = "-0.25rem";
const TAP_SCALE = 0.98;

const tileStyle: CSSProperties = {
  display: "flex",
  width: "100%",
};

const titleColor = "var(--canop-palette-primary-main)";

export function StoreHeroTile({ project }: StoreHeroTileProps) {
  const { docHref, status, canOpenApp, openApp, openDoc } = useStoreAppCard(project);
  const animated = !useReducedMotion();

  return (
    <motion.div
      style={tileStyle}
      whileHover={animated ? { y: HOVER_LIFT } : undefined}
      whileTap={animated ? { scale: TAP_SCALE } : undefined}
      transition={{ duration: motionDurationSeconds.fast, ease: motionEasing.springSoft }}
    >
      <Card
        elevation="md"
        radius="xl"
        density="comfortable"
        fill
        actions={
          <StoreAppCardActions
            name={project.name}
            canOpenApp={canOpenApp}
            onOpenApp={openApp}
            onOpenDoc={openDoc}
            actions={<StoreShortcutAction project={project} />}
          />
        }
      >
        <Stack gap="sm" fill>
          <Link component={RouterLink} to={docHref} color="primary">
            <Stack direction="row" gap="sm" alignItems="center">
              <ProjectLogo
                id={project.id}
                name={project.name}
                iconSrc={project.iconSrc}
                size="lg"
              />
              <Heading level={3} size={{ xs: 5, md: 4 }} gutterBottom={false} color={titleColor}>
                {project.name}
              </Heading>
            </Stack>
          </Link>
          {status ? (
            <Stack direction="row" gap="xs" alignItems="center">
              <StatusChip tone={status.tone} label={status.label} size="small" />
            </Stack>
          ) : null}
          {project.tagline ? <Text variant="body-md">{project.tagline}</Text> : null}
          <Text variant="body-sm" tone="muted">
            {project.description}
          </Text>
        </Stack>
      </Card>
    </motion.div>
  );
}
