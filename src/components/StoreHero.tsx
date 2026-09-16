import {
  Carousel,
  Heading,
  Icon,
  Stack,
  Text,
  useTranslation,
  type CanopCardGridProps,
} from "canopui";
import type { Project, Section } from "../data/types";
import { FrostedPanel } from "./FrostedPanel";
import { ProjectCardGrid } from "./ProjectCardGrid";
import { StoreHeroTile } from "./StoreHeroTile";
import { useStoreHero } from "./useStoreHero";

export interface StoreHeroProps {
  section: Section;
  projects: Project[];
}

const HERO_COLUMNS: CanopCardGridProps["columns"] = { xs: 1, sm: 1, md: 2, lg: 3 };

const HERO_MIN_ITEM_WIDTH = "18rem";

function renderHeroTile(project: Project) {
  return <StoreHeroTile project={project} />;
}

export function StoreHero({ section, projects }: StoreHeroProps) {
  const { compact, tagline, appsLabel } = useStoreHero(section);
  const { t } = useTranslation();

  return (
    <Stack as="section" gap="md" ariaLabel={section.label}>
      <FrostedPanel emphasis="hero">
        <Stack gap="lg">
          <Stack gap="xs">
            <Stack direction="row" gap="xs" alignItems="center">
              <Icon name="star" variant="solid" size="sm" color="accent" />
              <Text variant="overline" tone="muted">
                {t("store.hero.featured")}
              </Text>
            </Stack>
            <Heading level={2} size={{ xs: 4, md: 2 }} gutterBottom={false}>
              {section.label}
            </Heading>
            {tagline ? <Text variant="lead">{tagline}</Text> : null}
          </Stack>
          {compact ? (
            <Carousel ariaLabel={appsLabel} navigation="bars">
              {projects.map((project) => (
                <StoreHeroTile key={project.id} project={project} />
              ))}
            </Carousel>
          ) : (
            <ProjectCardGrid
              projects={projects}
              columns={HERO_COLUMNS}
              minItemWidth={HERO_MIN_ITEM_WIDTH}
              renderCard={renderHeroTile}
            />
          )}
        </Stack>
      </FrostedPanel>
    </Stack>
  );
}
