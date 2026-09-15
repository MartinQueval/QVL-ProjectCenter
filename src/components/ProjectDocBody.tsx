import { Spinner, Stack } from "canopui";
import type { ProjectDocState } from "../hooks/useProjectDoc";
import { DocLoadError } from "./DocLoadError";
import { MarkdownDoc } from "./MarkdownDoc";

export interface ProjectDocBodyProps {
  doc: ProjectDocState;
  docPath: string;
}

export function ProjectDocBody({ doc, docPath }: ProjectDocBodyProps) {
  if (doc.status === "loading") {
    return (
      <Stack alignItems="center" padding="xl">
        <Spinner ariaLabel="Chargement de la documentation…" />
      </Stack>
    );
  }

  if (doc.status === "error") {
    return <DocLoadError kind={doc.kind} onRetry={doc.retry} />;
  }

  return <MarkdownDoc markdown={doc.markdown} docPath={docPath} />;
}
