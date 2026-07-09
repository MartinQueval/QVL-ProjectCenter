import { Heading, PageContent, Stack } from "canopui";
import type { Project } from "../data/types";
import { useProjectDoc } from "../hooks/useProjectDoc";
import { ProjectDocBody } from "./ProjectDocBody";

export interface ProjectDocViewProps {
  project: Project;
}

export function ProjectDocView({ project }: ProjectDocViewProps) {
  const doc = useProjectDoc(project.docPath);

  return (
    <PageContent>
      <Stack gap="lg">
        <Heading level={1} size={3}>
          {project.name}
        </Heading>
        <ProjectDocBody doc={doc} docPath={project.docPath} />
      </Stack>
    </PageContent>
  );
}
