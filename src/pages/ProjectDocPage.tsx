import { Navigate } from "react-router-dom";
import { Feedback, Heading, PageContent, Stack } from "canopui";
import { useProjectDocPage } from "./useProjectDocPage";

export function ProjectDocPage() {
  const state = useProjectDocPage();

  if (state.notFound) {
    return <Navigate to="/" replace />;
  }

  return (
    <PageContent>
      <Stack gap="md">
        <Heading level={1} size={3}>
          {state.project.name}
        </Heading>
        <Feedback severity="info">Documentation à venir (US5).</Feedback>
      </Stack>
    </PageContent>
  );
}
