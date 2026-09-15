import type { CanopTranslate } from "canopui";
import type { Project } from "../data/types";
import { optionalText } from "./optionalText";

export interface ProjectText {
  tagline?: string;
  description: string;
}

export function projectText(t: CanopTranslate, project: Project): ProjectText {
  return {
    tagline: optionalText(t, `projects.${project.id}.tagline`),
    description: t(`projects.${project.id}.description`),
  };
}
