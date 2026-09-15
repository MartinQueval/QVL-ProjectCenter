import { EmptyState, Heading, Icon, PageContent, Stack, Text } from "canopui";
import { StoreHero } from "../components/StoreHero";
import { StoreSearch } from "../components/StoreSearch";
import { StoreSection } from "../components/StoreSection";
import { useHomePage } from "./useHomePage";

function noResultDescription(query: string): string {
  return `Rien ne correspond à « ${query} ». Essayez un autre mot, ou effacez la recherche.`;
}

export function HomePage() {
  const { query, onQueryChange, featured, sections, hasResults } = useHomePage();

  return (
    <PageContent>
      <Stack gap="xl">
        <Stack gap="xs">
          <Heading level={1} size={{ xs: 4, md: 2 }} gutterBottom={false}>
            Store QVL
          </Heading>
          <Text variant="lead" tone="secondary">
            Toutes les applications de la flotte, réunies au même endroit.
          </Text>
        </Stack>

        <StoreSearch value={query} onChange={onQueryChange} />

        {hasResults ? (
          <Stack gap="xl">
            {featured ? (
              <StoreHero section={featured.section} projects={featured.projects} />
            ) : null}
            {sections.map(({ section, projects }) => (
              <StoreSection key={section.slug} section={section} projects={projects} />
            ))}
          </Stack>
        ) : (
          <EmptyState
            title="Aucune application ne correspond"
            description={noResultDescription(query)}
            icon={<Icon name="search" size="lg" color="primary" />}
          />
        )}
      </Stack>
    </PageContent>
  );
}
