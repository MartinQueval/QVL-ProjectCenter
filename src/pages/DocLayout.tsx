import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { PageContent, Spinner, Stack, useTranslation } from "canopui";

export function DocLayout() {
  const { t } = useTranslation();

  return (
    <Suspense
      fallback={
        <PageContent>
          <Stack alignItems="center" padding="xl">
            <Spinner ariaLabel={t("doc.loading")} />
          </Stack>
        </PageContent>
      }
    >
      <Outlet />
    </Suspense>
  );
}
