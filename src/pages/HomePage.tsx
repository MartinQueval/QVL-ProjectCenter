import { Link as RouterLink } from "react-router-dom";
import { Link, PageContent, Stack } from "canopui";
import { SECTIONS } from "../data/projects";

export function HomePage() {
  return (
    <PageContent title="Portail des projets QVL">
      <Stack gap="sm" as="nav" label="Sections">
        {SECTIONS.map((section) => (
          <Link key={section.slug} component={RouterLink} to={`/${section.slug}`}>
            {section.label}
          </Link>
        ))}
      </Stack>
    </PageContent>
  );
}
