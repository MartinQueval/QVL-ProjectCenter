import type { ReactNode } from "react";
import { Button, Stack, useTranslation } from "canopui";
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
  const { t } = useTranslation();

  return (
    <Stack direction="row" gap="sm" alignItems="center" justifyContent="space-between" wrap fill>
      <Stack direction="row" gap="sm" alignItems="center" wrap>
        {canOpenApp ? (
          <Button variant="primary" onClick={onOpenApp}>
            {t("store.card.open")}
            <VisuallyHidden>{` ${t("store.card.openSuffix", { name })}`}</VisuallyHidden>
          </Button>
        ) : null}
        <StoreIconAction
          icon="document"
          ariaLabel={t("store.card.docLabel", { name })}
          hint={t("store.card.docHint")}
          onClick={onOpenDoc}
        />
      </Stack>
      {actions}
    </Stack>
  );
}
