import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import {
  Card,
  Stack,
  StatusChip,
  Text,
  motionDurationSeconds,
  motionEasing,
  type CanopResponsiveHeadingSize,
} from "canopui";
import type { Project } from "../data/types";
import { StoreAppCardActions } from "./StoreAppCardActions";
import { StoreCardTitle } from "./StoreCardTitle";
import { StoreShortcutAction } from "./StoreShortcutAction";
import { useStoreAppCard } from "./useStoreAppCard";
import { useStoreHeroTile } from "./useStoreHeroTile";

export interface StoreHeroTileProps {
  project: Project;
}

const HOVER_LIFT = "-0.25rem";
const TAP_SCALE = 0.98;

const tileStyle: CSSProperties = {
  display: "flex",
  width: "100%",
  minWidth: 0,
};

const HERO_TITLE_SIZE: CanopResponsiveHeadingSize = { xs: 6, sm: 5, md: 4 };

export function StoreHeroTile({ project }: StoreHeroTileProps) {
  const { docHref, status, text, canOpenApp, openApp, openDoc } = useStoreAppCard(project);
  const { animated, logoSize } = useStoreHeroTile();

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
          <StoreCardTitle
            project={project}
            docHref={docHref}
            size={HERO_TITLE_SIZE}
            logoSize={logoSize}
          />
          {status ? (
            <Stack direction="row" gap="xs" alignItems="center">
              <StatusChip tone={status.tone} label={status.label} size="small" />
            </Stack>
          ) : null}
          {text.tagline ? <Text variant="body-md">{text.tagline}</Text> : null}
          <Text variant="body-sm" tone="muted">
            {text.description}
          </Text>
        </Stack>
      </Card>
    </motion.div>
  );
}
