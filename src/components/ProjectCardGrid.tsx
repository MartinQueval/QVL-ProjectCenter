import type { CSSProperties, ReactNode } from "react";
import { motion } from "framer-motion";
import { CardGrid, useStagger, type CanopCardGridProps } from "canopui";
import type { Project } from "../data/types";

export interface ProjectCardGridProps {
  projects: Project[];
  renderCard: (project: Project) => ReactNode;
  columns?: CanopCardGridProps["columns"];
  minItemWidth?: string;
}

const gridItemStyle: CSSProperties = {
  display: "flex",
};

const DEFAULT_COLUMNS: CanopCardGridProps["columns"] = { sm: 2, lg: 4 };
const DEFAULT_MIN_ITEM_WIDTH = "16rem";

export function ProjectCardGrid({
  projects,
  renderCard,
  columns = DEFAULT_COLUMNS,
  minItemWidth = DEFAULT_MIN_ITEM_WIDTH,
}: ProjectCardGridProps) {
  const { container, item } = useStagger();

  return (
    <motion.div {...container}>
      <CardGrid minItemWidth={minItemWidth} columns={columns}>
        {projects.map((project) => (
          <motion.div key={project.id} variants={item.variants} style={gridItemStyle}>
            {renderCard(project)}
          </motion.div>
        ))}
      </CardGrid>
    </motion.div>
  );
}
