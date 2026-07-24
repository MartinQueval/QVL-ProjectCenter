import type { CSSProperties, ReactNode } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Card, Heading, Stack, tokens } from "canopui";
import type { Project } from "../data/types";
import { ProjectLogo } from "./ProjectLogo";
import { useProjectCard } from "./useProjectCard";

export type ProjectCardVariant = "auto" | "doc";

export interface ProjectCardProps {
  project: Project;
  variant?: ProjectCardVariant;
}

const linkStyle: CSSProperties = {
  display: "block",
  width: "100%",
  height: "100%",
  textDecoration: "none",
  color: "inherit",
  borderRadius: tokens.radius.md,
};

const descriptionStyle: CSSProperties = {
  color: "var(--ch-palette-text-secondary)",
  fontSize: tokens.typography.fontSize.sm,
};

export function ProjectCard({ project, variant = "auto" }: ProjectCardProps) {
  const { isRaised, interactionHandlers } = useProjectCard();

  const card: ReactNode = (
    <Card elevation={isRaised ? "lg" : "sm"} fill>
      <Stack gap="sm">
        <ProjectLogo name={project.name} logo={project.logo} />
        <Stack gap="xs">
          <Heading level={3} size={5} gutterBottom={false}>
            {project.name}
          </Heading>
          <span style={descriptionStyle}>{project.description}</span>
        </Stack>
      </Stack>
    </Card>
  );

  if (variant === "auto" && project.url) {
    return (
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Ouvrir ${project.name} dans un nouvel onglet`}
        style={linkStyle}
        {...interactionHandlers}
      >
        {card}
      </a>
    );
  }

  return (
    <RouterLink
      to={`/${project.section}/${project.id}`}
      aria-label={`Voir la documentation de ${project.name}`}
      style={linkStyle}
      {...interactionHandlers}
    >
      {card}
    </RouterLink>
  );
}
