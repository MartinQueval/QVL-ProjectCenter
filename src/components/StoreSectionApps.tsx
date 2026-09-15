import { Carousel, type CanopCardGridProps } from "canopui";
import type { Project } from "../data/types";
import { ProjectCardGrid } from "./ProjectCardGrid";
import { StoreAppCard } from "./StoreAppCard";
import { StoreShortcutAction } from "./StoreShortcutAction";

export interface StoreSectionAppsProps {
  projects: Project[];
  ariaLabel: string;
  compact: boolean;
}

const SECTION_COLUMNS: CanopCardGridProps["columns"] = { xs: 1, sm: 2, md: 3 };

function renderStoreAppCard(project: Project) {
  return <StoreAppCard project={project} actions={<StoreShortcutAction project={project} />} />;
}

export function StoreSectionApps({ projects, ariaLabel, compact }: StoreSectionAppsProps) {
  if (compact) {
    return (
      <Carousel ariaLabel={ariaLabel} navigation="bars">
        {projects.map((project) => (
          <StoreAppCard
            key={project.id}
            project={project}
            actions={<StoreShortcutAction project={project} />}
          />
        ))}
      </Carousel>
    );
  }

  return (
    <ProjectCardGrid
      projects={projects}
      columns={SECTION_COLUMNS}
      renderCard={renderStoreAppCard}
    />
  );
}
