import { PageContent, Stack } from "canopui";
import { HomeSection } from "../components/HomeSection";
import { useHomePage } from "./useHomePage";

export function HomePage() {
  const sections = useHomePage();

  return (
    <PageContent title="Portail des projets QVL">
      <Stack gap="xl">
        {sections.map(({ section, projects }) => (
          <HomeSection key={section.slug} section={section} projects={projects} />
        ))}
      </Stack>
    </PageContent>
  );
}
