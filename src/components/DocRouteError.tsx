import { Button, EmptyState, Icon, PageContent, Stack } from "canopui";
import { useDocRouteError } from "./useDocRouteError";

export function DocRouteError() {
  const { isCompact, reload, backToStore } = useDocRouteError();

  return (
    <PageContent>
      <EmptyState
        title="Section documentation indisponible"
        description="Cette partie de l'application n'a pas pu être chargée. Une nouvelle version a peut-être été déployée pendant votre visite : rechargez la page pour récupérer la dernière version."
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
              Recharger la page
            </Button>
            <Button variant="ghost" onClick={backToStore}>
              Retour au store
            </Button>
          </Stack>
        }
      />
    </PageContent>
  );
}
