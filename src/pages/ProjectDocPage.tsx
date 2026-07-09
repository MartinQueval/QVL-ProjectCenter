import { Feedback, Heading, PageContent, Stack } from "canopui";
import { useProjectDocPage } from "./useProjectDocPage";

export function ProjectDocPage() {
  const { project } = useProjectDocPage();

  if (!project) {
    return (
      <PageContent>
        <Feedback severity="error">Projet introuvable.</Feedback>
      </PageContent>
    );
  }

  return (
    <PageContent>
      <Stack gap="md">
        <Heading level={1} size={3}>
          {project.name}
        </Heading>
        <Feedback severity="info">Documentation à venir (US5).</Feedback>
      </Stack>
    </PageContent>
  );
}
