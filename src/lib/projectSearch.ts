import { foldForSearch } from "canopui";
import type { Project } from "../data/types";

export function projectMatchesSearch(project: Project, foldedQuery: string): boolean {
  return foldForSearch(
    [project.name, project.tagline ?? "", project.description].join(" "),
  ).includes(foldedQuery);
}
