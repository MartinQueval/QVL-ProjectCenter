import { Navigate } from "react-router-dom";
import { Feedback, PageContent, Stack } from "canopui";
import { SectionProjectGroup } from "../components/SectionProjectGroup";
import { useSectionPage } from "./useSectionPage";

export function SectionPage() {
  const state = useSectionPage();

  if (state.notFound) {
    return <Navigate to="/" replace />;
  }

  const { section, groups } = state;

  return (
    <PageContent>
      {groups.length === 0 ? (
        <Feedback severity="info">Aucun projet dans cette section pour le moment.</Feedback>
      ) : (
        <Stack gap="lg" as="nav" label={`Projets ${section.label}`}>
          {groups.map((group) => (
            <SectionProjectGroup key={group.project.id} sectionSlug={section.slug} group={group} />
          ))}
        </Stack>
      )}
    </PageContent>
  );
}
