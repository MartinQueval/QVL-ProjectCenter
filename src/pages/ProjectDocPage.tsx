import { Navigate } from "react-router-dom";
import { ProjectDocView } from "../components/ProjectDocView";
import { useProjectDocPage } from "./useProjectDocPage";

export function ProjectDocPage() {
  const state = useProjectDocPage();

  if (state.notFound) {
    return <Navigate to="/" replace />;
  }

  return <ProjectDocView project={state.project} />;
}
