import {
  Breadcrumb,
  EmptyState,
  Heading,
  Icon,
  PageContent,
  Stack,
  Text,
  useTranslation,
} from "canopui";
import { DocSearch } from "../components/DocSearch";
import { DocSearchSummary } from "../components/DocSearchSummary";
import { DocSectionList } from "../components/DocSectionList";
import { useDocBreadcrumbItems } from "../hooks/useDocBreadcrumbItems";
import { useDocIndexPage } from "./useDocIndexPage";

export function DocIndexPage() {
  const { query, setQuery, groups, hasResults, resultCount } = useDocIndexPage();
  const breadcrumbItems = useDocBreadcrumbItems();
  const { t } = useTranslation();

  return (
    <PageContent>
      <Stack gap="lg">
        <Breadcrumb items={breadcrumbItems} />
        <Stack gap="xs">
          <Heading level={1} size={{ xs: 5, md: 3 }} gutterBottom={false}>
            {t("doc.title")}
          </Heading>
          <Text variant="lead" tone="muted">
            {t("doc.subtitle")}
          </Text>
        </Stack>
        <DocSearch value={query} onChange={setQuery} />
        <DocSearchSummary count={resultCount} query={query} />
        {hasResults ? (
          <DocSectionList groups={groups} />
        ) : (
          <EmptyState
            title={t("doc.empty.title")}
            description={t("doc.empty.description")}
            icon={<Icon name="search" size="xl" color="neutral" />}
            surface="plain"
          />
        )}
      </Stack>
    </PageContent>
  );
}
