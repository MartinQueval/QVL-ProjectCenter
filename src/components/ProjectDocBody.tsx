import { Button, Feedback, Spinner, Stack } from "canopui";
import type { ProjectDocState } from "../hooks/useProjectDoc";
import { MarkdownDoc } from "./MarkdownDoc";

export interface ProjectDocBodyProps {
  doc: ProjectDocState;
  docPath: string;
}

export function ProjectDocBody({ doc, docPath }: ProjectDocBodyProps) {
  if (doc.status === "loading") {
    return <Spinner label="Chargement de la documentation…" />;
  }

  if (doc.status === "error") {
    if (doc.kind === "notFound") {
      return <Feedback severity="warning">Documentation introuvable.</Feedback>;
    }
    return (
      <Stack gap="sm" alignItems="start">
        <Feedback severity="error">Impossible de charger la documentation.</Feedback>
        <Button variant="secondary" onClick={doc.retry}>
          Réessayer
        </Button>
      </Stack>
    );
  }

  return <MarkdownDoc markdown={doc.markdown} docPath={docPath} />;
}
