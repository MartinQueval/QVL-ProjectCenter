import { Breadcrumb, EmptyState, Heading, Icon, PageContent, Stack, Text } from "canopui";
import { DocSearch } from "../components/DocSearch";
import { DocSearchSummary } from "../components/DocSearchSummary";
import { DocSectionList } from "../components/DocSectionList";
import { useDocBreadcrumbItems } from "../hooks/useDocBreadcrumbItems";
import { useDocIndexPage } from "./useDocIndexPage";

export function DocIndexPage() {
  const { query, setQuery, groups, hasResults, resultCount } = useDocIndexPage();
  const breadcrumbItems = useDocBreadcrumbItems();

  return (
    <PageContent>
      <Stack gap="lg">
        <Breadcrumb items={breadcrumbItems} />
        <Stack gap="xs">
          <Heading level={1} size={{ xs: 5, md: 3 }} gutterBottom={false}>
            Documentation
          </Heading>
          <Text variant="lead" tone="muted">
            Applications, APIs et outils internes de la flotte QVL, documentés par projet.
          </Text>
        </Stack>
        <DocSearch value={query} onChange={setQuery} />
        <DocSearchSummary count={resultCount} query={query} />
        {hasResults ? (
          <DocSectionList groups={groups} />
        ) : (
          <EmptyState
            title="Aucun résultat"
            description="Aucun projet ne correspond à cette recherche. Essayez un autre terme."
            icon={<Icon name="search" size="xl" color="neutral" />}
            surface="plain"
          />
        )}
      </Stack>
    </PageContent>
  );
}
