import { Breadcrumb, Heading, PageContent, Stack } from "canopui";
import type { Project } from "../data/types";
import { getSection } from "../data/projects";
import { useProjectDoc } from "../hooks/useProjectDoc";
import { useBreadcrumbItems } from "../hooks/useBreadcrumbItems";
import { ProjectDocBody } from "./ProjectDocBody";

export interface ProjectDocViewProps {
  project: Project;
}

export function ProjectDocView({ project }: ProjectDocViewProps) {
  const doc = useProjectDoc(project.docPath);
  const section = getSection(project.section);
  const breadcrumbItems = useBreadcrumbItems([
    { id: "home", label: "Accueil", href: "/" },
    ...(section ? [{ id: section.slug, label: section.label, href: `/${section.slug}` }] : []),
    { id: project.id, label: project.name },
  ]);

  return (
    <PageContent>
      <Stack gap="lg">
        <Breadcrumb items={breadcrumbItems} />
        <Heading level={1} size={3}>
          {project.name}
        </Heading>
        <ProjectDocBody doc={doc} docPath={project.docPath} />
      </Stack>
    </PageContent>
  );
}
