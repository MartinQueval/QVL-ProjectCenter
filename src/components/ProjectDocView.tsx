import { Breadcrumb, PageContent, Stack } from "canopui";
import type { Project } from "../data/types";
import { useProjectDoc } from "../hooks/useProjectDoc";
import { useDocBreadcrumbItems } from "../hooks/useDocBreadcrumbItems";
import { ProjectDocBody } from "./ProjectDocBody";
import { ProjectDocHeader } from "./ProjectDocHeader";

export interface ProjectDocViewProps {
  project: Project;
}

export function ProjectDocView({ project }: ProjectDocViewProps) {
  const doc = useProjectDoc(project.docPath);
  const breadcrumbItems = useDocBreadcrumbItems(project);

  return (
    <PageContent>
      <Stack gap="lg">
        <Breadcrumb items={breadcrumbItems} />
        <ProjectDocHeader project={project} />
        <ProjectDocBody doc={doc} docPath={project.docPath} />
      </Stack>
    </PageContent>
  );
}
