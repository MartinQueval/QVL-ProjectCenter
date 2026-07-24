import { Navigate } from "react-router-dom";
import { Breadcrumb, CardGrid, EmptyState, PageContent, Stack, Toolbar } from "canopui";
import { ProjectCard } from "../components/ProjectCard";
import { useBreadcrumbItems } from "../hooks/useBreadcrumbItems";
import { useSectionPage } from "./useSectionPage";

export function SectionPage() {
  const state = useSectionPage();
  const breadcrumbItems = useBreadcrumbItems(
    state.notFound
      ? []
      : [
          { id: "home", label: "Accueil", href: "/" },
          { id: state.section.slug, label: state.section.label },
        ],
  );

  if (state.notFound) {
    return <Navigate to="/" replace />;
  }

  const { section, query, setQuery, projects, hasProjects } = state;

  return (
    <PageContent>
      <Stack gap="lg">
        <Breadcrumb items={breadcrumbItems} />
        <Toolbar
          label={`Recherche ${section.label}`}
          search={{
            value: query,
            onChange: setQuery,
            placeholder: `Rechercher dans ${section.label}`,
          }}
        />
        {projects.length === 0 ? (
          <EmptyState
            title={hasProjects ? "Aucun résultat" : "Aucun projet"}
            description={
              hasProjects
                ? "Aucun projet ne correspond à votre recherche."
                : "Aucun projet dans cette section pour le moment."
            }
          />
        ) : (
          <CardGrid minItemWidth="18rem">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} variant="doc" />
            ))}
          </CardGrid>
        )}
      </Stack>
    </PageContent>
  );
}
