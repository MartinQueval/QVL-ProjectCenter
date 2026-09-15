import { Button, EmptyState, Icon, Stack } from "canopui";
import type { ProjectDocErrorKind } from "../hooks/useProjectDoc";
import { useDocLoadError } from "./useDocLoadError";

export interface DocLoadErrorProps {
  kind: ProjectDocErrorKind;
  onRetry: () => void;
}

export function DocLoadError({ kind, onRetry }: DocLoadErrorProps) {
  const { title, description, isCompact, backToIndex } = useDocLoadError(kind);

  return (
    <EmptyState
      title={title}
      description={description}
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
            onClick={onRetry}
            startIcon={<Icon name="refresh" size="sm" color="inherit" />}
          >
            Réessayer
          </Button>
          <Button variant="ghost" onClick={backToIndex}>
            Retour à la documentation
          </Button>
        </Stack>
      }
    />
  );
}
