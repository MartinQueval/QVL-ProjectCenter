import { useParams } from "react-router-dom";
import { DOC_PATH } from "../hooks/useAppNavigation";

export function useLegacyDocRedirect(): string {
  const { projectId } = useParams();

  return projectId ? `${DOC_PATH}/${projectId}` : DOC_PATH;
}
