import type { ReactNode } from "react";
import { Button, Stack } from "canopui";
import { StoreIconAction } from "./StoreIconAction";
import { VisuallyHidden } from "./VisuallyHidden";

export interface StoreAppCardActionsProps {
  name: string;
  canOpenApp: boolean;
  onOpenApp: () => void;
  onOpenDoc: () => void;
  actions?: ReactNode;
}

export function StoreAppCardActions({
  name,
  canOpenApp,
  onOpenApp,
  onOpenDoc,
  actions,
}: StoreAppCardActionsProps) {
  return (
    <Stack direction="row" gap="sm" alignItems="center" justifyContent="space-between" wrap fill>
      <Stack direction="row" gap="sm" alignItems="center" wrap>
        {canOpenApp ? (
          <Button variant="primary" onClick={onOpenApp}>
            Ouvrir
            <VisuallyHidden>{` ${name} dans un nouvel onglet`}</VisuallyHidden>
          </Button>
        ) : null}
        <StoreIconAction
          icon="document"
          ariaLabel={`Documentation de ${name}`}
          hint="Voir la documentation"
          onClick={onOpenDoc}
        />
      </Stack>
      {actions}
    </Stack>
  );
}
