import { Breadcrumb, Button, EmptyState, Icon, PageContent, Stack, useTranslation } from "canopui";
import { useDocBreadcrumbItems } from "../hooks/useDocBreadcrumbItems";
import { useDocNotFound } from "./useDocNotFound";

export function DocNotFound() {
  const backToIndex = useDocNotFound();
  const breadcrumbItems = useDocBreadcrumbItems();
  const { t } = useTranslation();

  return (
    <PageContent>
      <Stack gap="lg">
        <Breadcrumb items={breadcrumbItems} />
        <EmptyState
          title={t("doc.notFound.title")}
          description={t("doc.notFound.description")}
          headingLevel={1}
          icon={<Icon name="fileText" size="xl" color="neutral" />}
          action={
            <Button variant="primary" onClick={backToIndex}>
              {t("doc.notFound.back")}
            </Button>
          }
        />
      </Stack>
    </PageContent>
  );
}
