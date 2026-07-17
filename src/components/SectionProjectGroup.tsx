import type { CSSProperties } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Link, Stack, tokens } from "canopui";
import type { ProjectGroup, SectionSlug } from "../data/types";

export interface SectionProjectGroupProps {
  sectionSlug: SectionSlug;
  group: ProjectGroup;
}

const childrenStyle: CSSProperties = {
  marginLeft: tokens.spacing.md,
  paddingLeft: tokens.spacing.md,
  borderLeft: `0.0625rem solid var(--ch-palette-divider)`,
};

export function SectionProjectGroup({ sectionSlug, group }: SectionProjectGroupProps) {
  const { project, children } = group;

  return (
    <Stack gap="sm">
      <Link component={RouterLink} to={`/${sectionSlug}/${project.id}`}>
        {project.name}
      </Link>
      {children.length > 0 && (
        <div style={childrenStyle}>
          <Stack gap="xs">
            {children.map((child) => (
              <Link
                key={child.id}
                component={RouterLink}
                to={`/${sectionSlug}/${child.id}`}
                size="small"
                color="muted"
              >
                {child.name}
              </Link>
            ))}
          </Stack>
        </div>
      )}
    </Stack>
  );
}
