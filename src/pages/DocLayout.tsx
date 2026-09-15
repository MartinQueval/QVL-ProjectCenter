import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { PageContent, Spinner, Stack } from "canopui";

export function DocLayout() {
  return (
    <Suspense
      fallback={
        <PageContent>
          <Stack alignItems="center" padding="xl">
            <Spinner ariaLabel="Chargement de la documentation…" />
          </Stack>
        </PageContent>
      }
    >
      <Outlet />
    </Suspense>
  );
}
