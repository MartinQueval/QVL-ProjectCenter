import { EmptyState, Heading, Icon, PageContent, Stack, Text, useTranslation } from "canopui";
import { FrostedPanel } from "../components/FrostedPanel";
import { StoreHero } from "../components/StoreHero";
import { StoreSearch } from "../components/StoreSearch";
import { StoreSection } from "../components/StoreSection";
import { useHomePage } from "./useHomePage";

export function HomePage() {
  const { query, onQueryChange, featured, sections, hasResults } = useHomePage();
  const { t } = useTranslation();

  return (
    <PageContent>
      <Stack gap="xl">
        <FrostedPanel>
          <Stack gap="xs">
            <Heading level={1} size={{ xs: 4, md: 2 }} gutterBottom={false}>
              {t("store.title")}
            </Heading>
            <Text variant="lead" tone="muted">
              {t("store.subtitle")}
            </Text>
          </Stack>
        </FrostedPanel>

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
            title={t("store.empty.title")}
            description={t("store.empty.description", { query })}
            icon={<Icon name="search" size="lg" color="primary" />}
          />
        )}
      </Stack>
    </PageContent>
  );
}
