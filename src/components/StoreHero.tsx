import { Carousel, Heading, Icon, Stack, Text, type CanopCardGridProps } from "canopui";
import type { Project, Section } from "../data/types";
import { ProjectCardGrid } from "./ProjectCardGrid";
import { StoreHeroTile } from "./StoreHeroTile";
import { useStoreHero } from "./useStoreHero";

export interface StoreHeroProps {
  section: Section;
  projects: Project[];
}

const HERO_COLUMNS: CanopCardGridProps["columns"] = { xs: 1, sm: 1, md: 3 };

const HERO_MIN_ITEM_WIDTH = "18rem";

function renderHeroTile(project: Project) {
  return <StoreHeroTile project={project} />;
}

export function StoreHero({ section, projects }: StoreHeroProps) {
  const { compact, bandStyle } = useStoreHero();
  const appsLabel = `Applications ${section.label}`;

  return (
    <Stack as="section" gap="md" ariaLabel={section.label}>
      <div style={bandStyle}>
        <Stack gap="lg">
          <Stack gap="xs">
            <Stack direction="row" gap="xs" alignItems="center">
              <Icon name="star" variant="solid" size="sm" color="accent" />
              <Text variant="overline" tone="secondary">
                À la une
              </Text>
            </Stack>
            <Heading level={2} size={{ xs: 4, md: 2 }} gutterBottom={false}>
              {section.label}
            </Heading>
            {section.tagline ? <Text variant="lead">{section.tagline}</Text> : null}
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
      </div>
    </Stack>
  );
}
