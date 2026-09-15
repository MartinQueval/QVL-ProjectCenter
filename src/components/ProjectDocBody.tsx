import { Spinner, Stack, useTranslation } from "canopui";
import type { ProjectDocState } from "../hooks/useProjectDoc";
import { DocLoadError } from "./DocLoadError";
import { MarkdownDoc } from "./MarkdownDoc";

export interface ProjectDocBodyProps {
  doc: ProjectDocState;
  docPath: string;
}

export function ProjectDocBody({ doc, docPath }: ProjectDocBodyProps) {
  const { t } = useTranslation();

  if (doc.status === "loading") {
    return (
      <Stack alignItems="center" padding="xl">
        <Spinner ariaLabel={t("doc.loading")} />
      </Stack>
    );
  }

  if (doc.status === "error") {
    return <DocLoadError kind={doc.kind} onRetry={doc.retry} />;
  }

  return <MarkdownDoc markdown={doc.markdown} docPath={docPath} />;
}
