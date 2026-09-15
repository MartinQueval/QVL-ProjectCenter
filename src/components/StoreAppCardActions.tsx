import type { ReactNode } from "react";
import { Button, Stack } from "canopui";
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
    <Stack direction="row" gap="sm" alignItems="center" wrap fill>
      {canOpenApp ? (
        <Button variant="primary" onClick={onOpenApp}>
          Ouvrir
          <VisuallyHidden>{` ${name} dans un nouvel onglet`}</VisuallyHidden>
        </Button>
      ) : null}
      <Button variant="ghost" onClick={onOpenDoc}>
        Doc
        <VisuallyHidden>{` — documentation de ${name}`}</VisuallyHidden>
      </Button>
      {actions}
    </Stack>
  );
}
