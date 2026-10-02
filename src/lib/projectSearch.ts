import { foldForSearch, type CanopTranslate } from "@canop/ui";
import type { Project } from "../data/types";
import { projectText } from "../i18n/projectText";

export function projectMatchesSearch(
  t: CanopTranslate,
  project: Project,
  foldedQuery: string,
): boolean {
  const { tagline, description } = projectText(t, project);

  return foldForSearch([project.name, tagline ?? "", description].join(" ")).includes(foldedQuery);
}
