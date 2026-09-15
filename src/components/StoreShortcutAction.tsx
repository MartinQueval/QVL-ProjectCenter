import type { Project } from "../data/types";
import { DownloadShortcutButton } from "./DownloadShortcutButton";

export interface StoreShortcutActionProps {
  project: Project;
}

export function StoreShortcutAction({ project }: StoreShortcutActionProps) {
  if (project.url === undefined) {
    return null;
  }

  return <DownloadShortcutButton name={project.name} url={project.url} />;
}
