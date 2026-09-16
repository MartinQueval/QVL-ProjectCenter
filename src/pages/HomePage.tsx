import { EmptyState, Icon, PageContent, Stack, useTranslation } from "canopui";
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
        <StoreSearch value={query} onChange={onQueryChange} />
        {hasResults ? (
          <>
            {featured ? (
              <StoreHero section={featured.section} projects={featured.projects} />
            ) : null}
            {sections.map(({ section, projects }) => (
              <StoreSection key={section.slug} section={section} projects={projects} />
            ))}
          </>
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
