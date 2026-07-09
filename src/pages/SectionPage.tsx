import { Link as RouterLink, Navigate } from "react-router-dom";
import { Feedback, Link, PageContent, Stack } from "canopui";
import { useSectionPage } from "./useSectionPage";

export function SectionPage() {
  const state = useSectionPage();

  if (state.notFound) {
    return <Navigate to="/" replace />;
  }

  const { section, projects } = state;

  return (
    <PageContent>
      {projects.length === 0 ? (
        <Feedback severity="info">Aucun projet dans cette section pour le moment.</Feedback>
      ) : (
        <Stack gap="sm" as="nav" label={`Projets ${section.label}`}>
          {projects.map((project) => (
            <Link
              key={project.id}
              component={RouterLink}
              to={`/${section.slug}/${project.id}`}
            >
              {project.name}
            </Link>
          ))}
        </Stack>
      )}
    </PageContent>
  );
}
