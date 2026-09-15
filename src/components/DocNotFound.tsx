import { Breadcrumb, Button, EmptyState, Icon, PageContent, Stack } from "canopui";
import { useDocBreadcrumbItems } from "../hooks/useDocBreadcrumbItems";
import { useDocNotFound } from "./useDocNotFound";

export function DocNotFound() {
  const backToIndex = useDocNotFound();
  const breadcrumbItems = useDocBreadcrumbItems();

  return (
    <PageContent>
      <Stack gap="lg">
        <Breadcrumb items={breadcrumbItems} />
        <EmptyState
          title="Documentation introuvable"
          description="Ce projet n'existe pas ou sa documentation a été déplacée."
          headingLevel={1}
          icon={<Icon name="fileText" size="xl" color="neutral" />}
          action={
            <Button variant="primary" onClick={backToIndex}>
              Retour à la documentation
            </Button>
          }
        />
      </Stack>
    </PageContent>
  );
}
