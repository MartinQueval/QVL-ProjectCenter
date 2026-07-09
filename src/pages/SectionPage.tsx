import { Link as RouterLink } from "react-router-dom";
import { Feedback, Link, PageContent, Stack } from "canopui";
import { useSectionPage } from "./useSectionPage";

export function SectionPage() {
  const { section, projects } = useSectionPage();

  if (!section) {
    return (
      <PageContent>
        <Feedback severity="error">Section introuvable.</Feedback>
      </PageContent>
    );
  }

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
