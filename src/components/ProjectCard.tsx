import type { CSSProperties, ReactNode } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Card, tokens } from "canopui";
import type { Project } from "../data/types";
import { ProjectLogo } from "./ProjectLogo";
import { useProjectCard } from "./useProjectCard";

export interface ProjectCardProps {
  project: Project;
}

const linkStyle: CSSProperties = {
  display: "block",
  width: "100%",
  maxWidth: "22rem",
  textDecoration: "none",
  color: "inherit",
  borderRadius: tokens.radius.md,
};

export function ProjectCard({ project }: ProjectCardProps) {
  const { isRaised, interactionHandlers } = useProjectCard();

  const card: ReactNode = (
    <Card title={project.name} subtitle={project.description} elevation={isRaised ? "lg" : "sm"}>
      <ProjectLogo name={project.name} logo={project.logo} />
    </Card>
  );

  if (project.url) {
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
