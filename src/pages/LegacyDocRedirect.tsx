import { Navigate } from "react-router-dom";
import { useLegacyDocRedirect } from "./useLegacyDocRedirect";

export function LegacyDocRedirect() {
  const target = useLegacyDocRedirect();

  return <Navigate to={target} replace />;
}
