import { Button, EmptyState, Icon, PageContent, Stack, useTranslation } from "canopui";
import { useDocRouteError } from "./useDocRouteError";

export function DocRouteError() {
  const { isCompact, reload, backToStore } = useDocRouteError();
  const { t } = useTranslation();

  return (
    <PageContent>
      <EmptyState
        title={t("doc.route.error.title")}
        description={t("doc.route.error.description")}
        surface="plain"
        headingLevel={2}
        icon={<Icon name="cloud" size="xl" color="neutral" />}
        action={
          <Stack
            direction={isCompact ? "column" : "row"}
            gap="sm"
            alignItems={isCompact ? "stretch" : "center"}
            justifyContent="center"
          >
            <Button
              variant="primary"
              onClick={reload}
              startIcon={<Icon name="refresh" size="sm" color="inherit" />}
            >
              {t("doc.route.error.reload")}
            </Button>
            <Button variant="ghost" onClick={backToStore}>
              {t("doc.route.error.backToStore")}
            </Button>
          </Stack>
        }
      />
    </PageContent>
  );
}
