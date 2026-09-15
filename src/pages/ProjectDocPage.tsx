import { DocNotFound } from "../components/DocNotFound";
import { ProjectDocView } from "../components/ProjectDocView";
import { useProjectDocPage } from "./useProjectDocPage";

export function ProjectDocPage() {
  const state = useProjectDocPage();

  if (state.notFound) {
    return <DocNotFound />;
  }

  return <ProjectDocView project={state.project} />;
}
