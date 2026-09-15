import { Link as RouterLink } from "react-router-dom";
import { Heading, Link, Stack, type CanopHeadingProps } from "canopui";
import type { Project } from "../data/types";
import { ProjectLogo, type ProjectLogoSize } from "./ProjectLogo";

export interface StoreCardTitleProps {
  project: Project;
  docHref: string;
  size: CanopHeadingProps["size"];
  logoSize?: ProjectLogoSize;
}

const TITLE_COLOR = "var(--canop-palette-primary-main)";

export function StoreCardTitle({ project, docHref, size, logoSize }: StoreCardTitleProps) {
  return (
    <Link component={RouterLink} to={docHref} color="primary">
      <Stack direction="row" gap="sm" alignItems="center">
        <ProjectLogo
          id={project.id}
          name={project.name}
          iconSrc={project.iconSrc}
          size={logoSize}
        />
        <Stack fill>
          <Heading level={3} size={size} gutterBottom={false} color={TITLE_COLOR}>
            {project.name}
          </Heading>
        </Stack>
      </Stack>
    </Link>
  );
}
